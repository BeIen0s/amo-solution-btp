import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Res,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request, Response } from 'express';

import { AuthService, AuthResult } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { 
  Public, 
  CurrentUser, 
  UserId, 
  ClientIp, 
  UserAgent 
} from '../../common/decorators/auth.decorators';
import {
  LoginDto,
  RegisterDto,
  TwoFactorDto,
  ChangePasswordDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyTwoFactorCodeDto,
} from './dto';

@ApiTags('Auth')
@Controller('auth')
@UseGuards(ThrottlerGuard) // Protection contre le brute force
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  // ===== CONNEXION =====
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Connexion utilisateur',
    description: 'Authentifie un utilisateur avec email/mot de passe et optionnellement le code 2FA'
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Connexion réussie', 
    schema: {
      properties: {
        user: { type: 'object' },
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
        requiresTwoFactor: { type: 'boolean' },
        tempToken: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  @ApiResponse({ status: 403, description: 'Compte verrouillé ou inactif' })
  @ApiResponse({ status: 429, description: 'Trop de tentatives de connexion' })
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @ClientIp() ip: string,
    @UserAgent() userAgent: string,
  ): Promise<AuthResult> {
    this.logger.log(`Tentative de connexion pour ${loginDto.email} depuis ${ip}`);

    const result = await this.authService.login(loginDto);

    // Si la connexion nécessite la 2FA, ne pas définir les cookies
    if (result.requiresTwoFactor) {
      return result;
    }

    // Définir les cookies sécurisés pour les tokens
    this.setAuthCookies(res, result.accessToken, result.refreshToken);

    this.logger.log(`Connexion réussie pour ${loginDto.email}`);
    return result;
  }

  // ===== VÉRIFICATION 2FA =====
  @Public()
  @Post('verify-2fa')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Vérification du code 2FA',
    description: 'Vérifie le code 2FA et termine la connexion'
  })
  @ApiBody({ type: TwoFactorDto })
  @ApiResponse({ status: 200, description: 'Code 2FA valide, connexion réussie' })
  @ApiResponse({ status: 401, description: 'Code 2FA invalide ou token temporaire expiré' })
  async verifyTwoFactor(
    @Body() twoFactorDto: TwoFactorDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResult> {
    const result = await this.authService.verifyTwoFactor(twoFactorDto);

    // Définir les cookies sécurisés
    this.setAuthCookies(res, result.accessToken, result.refreshToken);

    this.logger.log(`Vérification 2FA réussie pour ${result.user.email}`);
    return result;
  }

  // ===== DÉCONNEXION =====
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Déconnexion utilisateur',
    description: 'Révoque le token de rafraîchissement et supprime les cookies'
  })
  @ApiResponse({ status: 200, description: 'Déconnexion réussie' })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user: any,
  ): Promise<{ message: string }> {
    const refreshToken = req.cookies?.refresh_token || '';

    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    // Supprimer les cookies
    this.clearAuthCookies(res);

    this.logger.log(`Déconnexion pour ${user.email}`);
    return { message: 'Déconnexion réussie' };
  }

  // ===== RAFRAÎCHISSEMENT DU TOKEN =====
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Rafraîchir le token d\'accès',
    description: 'Génère un nouveau token d\'accès à partir du token de rafraîchissement'
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Token rafraîchi avec succès' })
  @ApiResponse({ status: 401, description: 'Token de rafraîchissement invalide' })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Utiliser le token du body ou des cookies
    const refreshToken = refreshTokenDto.refreshToken || req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('Token de rafraîchissement requis');
    }

    const tokens = await this.authService.refreshTokens(refreshToken);

    // Mettre à jour les cookies
    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    return tokens;
  }

  // ===== PROFIL UTILISATEUR ACTUEL =====
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Profil de l\'utilisateur connecté',
    description: 'Récupère les informations de l\'utilisateur actuellement connecté'
  })
  @ApiResponse({ status: 200, description: 'Profil utilisateur' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  async getProfile(@CurrentUser() user: any) {
    return user;
  }

  // ===== CHANGEMENT DE MOT DE PASSE =====
  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Changement de mot de passe',
    description: 'Change le mot de passe de l\'utilisateur connecté'
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status: 200, description: 'Mot de passe modifié avec succès' })
  @ApiResponse({ status: 400, description: 'Mot de passe actuel incorrect' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  async changePassword(
    @UserId() userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.changePassword(userId, changePasswordDto);
    
    this.logger.log(`Mot de passe changé pour l'utilisateur ${userId}`);
    return { message: 'Mot de passe modifié avec succès' };
  }

  // ===== ACTIVATION 2FA =====
  @Post('enable-2fa')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Activer la 2FA',
    description: 'Génère un QR code pour configurer l\'authentification à deux facteurs'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'QR code généré pour la configuration 2FA',
    schema: {
      properties: {
        qrCodeUrl: { type: 'string' },
        secret: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 400, description: '2FA déjà activée' })
  async enableTwoFactor(@UserId() userId: string) {
    const result = await this.authService.enableTwoFactor(userId);
    
    this.logger.log(`Demande d'activation 2FA pour l'utilisateur ${userId}`);
    return result;
  }

  // ===== CONFIRMATION ACTIVATION 2FA =====
  @Post('confirm-2fa')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Confirmer l\'activation 2FA',
    description: 'Confirme l\'activation de la 2FA avec un code de vérification'
  })
  @ApiBody({ type: VerifyTwoFactorCodeDto })
  @ApiResponse({ status: 200, description: '2FA activée avec succès' })
  @ApiResponse({ status: 400, description: 'Code de vérification invalide' })
  async confirmTwoFactor(
    @UserId() userId: string,
    @Body() { code }: VerifyTwoFactorCodeDto,
  ): Promise<{ message: string }> {
    await this.authService.confirmTwoFactor(userId, code);
    
    this.logger.log(`2FA activée pour l'utilisateur ${userId}`);
    return { message: '2FA activée avec succès' };
  }

  // ===== DÉSACTIVATION 2FA =====
  @Post('disable-2fa')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Désactiver la 2FA',
    description: 'Désactive l\'authentification à deux facteurs'
  })
  @ApiBody({ type: VerifyTwoFactorCodeDto })
  @ApiResponse({ status: 200, description: '2FA désactivée avec succès' })
  @ApiResponse({ status: 400, description: 'Code de vérification invalide ou 2FA non activée' })
  async disableTwoFactor(
    @UserId() userId: string,
    @Body() { code }: VerifyTwoFactorCodeDto,
  ): Promise<{ message: string }> {
    await this.authService.disableTwoFactor(userId, code);
    
    this.logger.log(`2FA désactivée pour l'utilisateur ${userId}`);
    return { message: '2FA désactivée avec succès' };
  }

  // ===== MÉTHODES UTILITAIRES PRIVÉES =====

  /**
   * Définit les cookies d'authentification sécurisés
   */
  private setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
    const isProduction = process.env.NODE_ENV === 'production';

    // Cookie pour le token d'accès (plus court)
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Cookie pour le token de rafraîchissement (plus long)
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    });
  }

  /**
   * Supprime les cookies d'authentification
   */
  private clearAuthCookies(res: Response): void {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }
}