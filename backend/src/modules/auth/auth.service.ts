import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
  Logger,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

import { PrismaService } from '../../common/services/prisma.service';
import { User, UserStatus, RefreshToken } from '@prisma/client';
import { LoginDto, RegisterDto, TwoFactorDto, ChangePasswordDto } from './dto';

export interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

export interface AuthResult {
  user: Omit<User, 'password'>;
  accessToken: string;
  refreshToken: string;
  requiresTwoFactor?: boolean;
  tempToken?: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Connexion utilisateur avec vérification des credentials
   */
  async login(loginDto: LoginDto): Promise<AuthResult> {
    const { email, password, twoFactorCode } = loginDto;

    // Récupération de l'utilisateur avec ses rôles
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      await this.simulatePasswordCheck(); // Protection contre l'énumération
      throw new UnauthorizedException('Identifiants invalides');
    }

    // Vérification du statut du compte
    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException('Compte désactivé ou en attente de vérification');
    }

    // Vérification du verrouillage du compte
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new ForbiddenException(
        `Compte verrouillé jusqu'à ${user.lockedUntil.toLocaleString()}`
      );
    }

    // Vérification du mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await this.handleFailedLogin(user.id);
      throw new UnauthorizedException('Identifiants invalides');
    }

    // Réinitialiser les tentatives de connexion en cas de succès
    if (user.loginAttempts > 0) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          loginAttempts: 0,
          lockedUntil: null,
        },
      });
    }

    // Vérification de la 2FA si activée
    if (user.twoFactorEnabled) {
      if (!twoFactorCode) {
        // Générer un token temporaire pour la 2FA
        const tempToken = this.generateTempToken(user.id);
        return {
          user: this.excludePassword(user),
          accessToken: '',
          refreshToken: '',
          requiresTwoFactor: true,
          tempToken,
        };
      }

      if (!this.verifyTwoFactorCode(user.twoFactorSecret, twoFactorCode)) {
        throw new UnauthorizedException('Code de vérification invalide');
      }
    }

    // Mise à jour de la dernière connexion
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Génération des tokens
    const tokens = await this.generateTokens(user);

    this.logger.log(`Connexion réussie pour ${user.email}`);

    return {
      user: this.excludePassword(user),
      ...tokens,
    };
  }

  /**
   * Vérification du code 2FA avec token temporaire
   */
  async verifyTwoFactor(twoFactorDto: TwoFactorDto): Promise<AuthResult> {
    const { tempToken, code } = twoFactorDto;

    // Vérifier le token temporaire
    const payload = this.verifyTempToken(tempToken);
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user || !user.twoFactorEnabled) {
      throw new UnauthorizedException('Session invalide');
    }

    if (!this.verifyTwoFactorCode(user.twoFactorSecret, code)) {
      throw new UnauthorizedException('Code de vérification invalide');
    }

    // Mise à jour de la dernière connexion
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user);

    return {
      user: this.excludePassword(user),
      ...tokens,
    };
  }

  /**
   * Déconnexion et révocation du refresh token
   */
  async logout(refreshToken: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { isRevoked: true },
    });

    this.logger.log('Déconnexion réussie');
  }

  /**
   * Rafraîchissement du token d'accès
   */
  async refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const token = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!token || token.isRevoked || token.expiresAt < new Date()) {
      throw new UnauthorizedException('Token de rafraîchissement invalide');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: token.userId },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Utilisateur non trouvé ou inactif');
    }

    // Révoquer l'ancien token
    await this.prisma.refreshToken.update({
      where: { id: token.id },
      data: { isRevoked: true },
    });

    // Générer de nouveaux tokens
    return this.generateTokens(user);
  }

  /**
   * Changement de mot de passe
   */
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    // Vérifier le mot de passe actuel
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Mot de passe actuel incorrect');
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Mettre à jour le mot de passe
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Révoquer tous les refresh tokens existants
    await this.prisma.refreshToken.updateMany({
      where: { userId },
      data: { isRevoked: true },
    });

    this.logger.log(`Mot de passe changé pour l'utilisateur ${userId}`);
  }

  /**
   * Activation de la 2FA
   */
  async enableTwoFactor(userId: string): Promise<{ qrCodeUrl: string; secret: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    if (user.twoFactorEnabled) {
      throw new BadRequestException('La 2FA est déjà activée');
    }

    // Générer un secret 2FA
    const secret = speakeasy.generateSecret({
      name: `${user.email} (${this.configService.get('twoFactor.serviceName')})`,
      issuer: this.configService.get('twoFactor.issuer'),
    });

    // Générer le QR code
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

    // Sauvegarder le secret (temporairement, sera confirmé lors de la vérification)
    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret.base32 },
    });

    return {
      qrCodeUrl,
      secret: secret.base32,
    };
  }

  /**
   * Confirmation de l'activation 2FA
   */
  async confirmTwoFactor(userId: string, code: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.twoFactorSecret) {
      throw new BadRequestException('Configuration 2FA non trouvée');
    }

    if (!this.verifyTwoFactorCode(user.twoFactorSecret, code)) {
      throw new BadRequestException('Code de vérification invalide');
    }

    // Activer la 2FA
    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    });

    this.logger.log(`2FA activée pour l'utilisateur ${userId}`);
  }

  /**
   * Désactivation de la 2FA
   */
  async disableTwoFactor(userId: string, code: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.twoFactorEnabled) {
      throw new BadRequestException('2FA non activée');
    }

    if (!this.verifyTwoFactorCode(user.twoFactorSecret, code)) {
      throw new BadRequestException('Code de vérification invalide');
    }

    // Désactiver la 2FA
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
      },
    });

    this.logger.log(`2FA désactivée pour l'utilisateur ${userId}`);
  }

  /**
   * Génération des tokens JWT
   */
  private async generateTokens(user: any): Promise<{ accessToken: string; refreshToken: string }> {
    const roles = user.roles.map(userRole => userRole.role.name);
    
    const jwtPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles,
    };

    const accessToken = this.jwtService.sign(jwtPayload, {
      expiresIn: this.configService.get('jwt.expiresIn'),
      secret: this.configService.get('jwt.secret'),
    });

    const refreshToken = uuidv4();
    const refreshExpiresAt = new Date();
    refreshExpiresAt.setTime(
      refreshExpiresAt.getTime() + 
      this.parseTimeToMs(this.configService.get('jwt.refreshExpiresIn'))
    );

    // Sauvegarder le refresh token
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: refreshExpiresAt,
      },
    });

    return { accessToken, refreshToken };
  }

  /**
   * Génération d'un token temporaire pour la 2FA
   */
  private generateTempToken(userId: string): string {
    return this.jwtService.sign(
      { userId, type: 'temp' },
      {
        expiresIn: '10m',
        secret: this.configService.get('jwt.secret'),
      }
    );
  }

  /**
   * Vérification d'un token temporaire
   */
  private verifyTempToken(token: string): { userId: string; type: string } {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get('jwt.secret'),
      });
    } catch (error) {
      throw new UnauthorizedException('Token temporaire invalide');
    }
  }

  /**
   * Vérification du code 2FA
   */
  private verifyTwoFactorCode(secret: string, code: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: code,
      window: 2, // Permettre 2 intervalles de tolérance
    });
  }

  /**
   * Gestion des tentatives de connexion échouées
   */
  private async handleFailedLogin(userId: string): Promise<void> {
    const maxAttempts = 5;
    const lockoutDuration = 30 * 60 * 1000; // 30 minutes

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        loginAttempts: { increment: 1 },
      },
    });

    if (user.loginAttempts >= maxAttempts) {
      const lockedUntil = new Date(Date.now() + lockoutDuration);
      await this.prisma.user.update({
        where: { id: userId },
        data: { lockedUntil },
      });
      
      this.logger.warn(`Compte verrouillé pour ${user.email} jusqu'à ${lockedUntil}`);
    }
  }

  /**
   * Simulation de vérification de mot de passe (protection contre l'énumération)
   */
  private async simulatePasswordCheck(): Promise<void> {
    await bcrypt.compare('fake-password', '$2b$12$fakeHashToSimulatePasswordCheck');
  }

  /**
   * Exclure le mot de passe de l'objet utilisateur
   */
  private excludePassword(user: any): Omit<User, 'password'> {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Conversion d'une durée en millisecondes
   */
  private parseTimeToMs(time: string): number {
    const unit = time.slice(-1);
    const value = parseInt(time.slice(0, -1));
    
    switch (unit) {
      case 's': return value * 1000;
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      default: return value;
    }
  }
}