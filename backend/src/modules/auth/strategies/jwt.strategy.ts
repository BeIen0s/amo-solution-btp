import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

import { PrismaService } from '../../../common/services/prisma.service';
import { JwtPayload } from '../auth.service';
import { UserStatus } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Extraire le token depuis l'en-tête Authorization
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        // Extraire le token depuis les cookies (pour les applications web)
        (request: Request) => {
          return request?.cookies?.access_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.secret'),
      passReqToCallback: true, // Pour avoir accès à la requête dans validate
    });
  }

  /**
   * Validation du payload JWT et récupération de l'utilisateur
   */
  async validate(request: Request, payload: JwtPayload) {
    try {
      // Vérification de base du payload
      if (!payload.sub || !payload.email) {
        this.logger.warn('Payload JWT invalide - sub ou email manquant');
        throw new UnauthorizedException('Token invalide');
      }

      // Récupération de l'utilisateur avec ses rôles
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          username: true,
          phone: true,
          avatar: true,
          status: true,
          emailVerified: true,
          twoFactorEnabled: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
          roles: {
            select: {
              role: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  permissions: true,
                },
              },
            },
          },
        },
      });

      // Vérifier que l'utilisateur existe
      if (!user) {
        this.logger.warn(`Utilisateur ${payload.sub} non trouvé`);
        throw new UnauthorizedException('Utilisateur non trouvé');
      }

      // Vérifier que l'utilisateur est actif
      if (user.status !== UserStatus.ACTIVE) {
        this.logger.warn(`Utilisateur ${user.email} non actif - Statut: ${user.status}`);
        throw new UnauthorizedException('Compte désactivé');
      }

      // Vérifier que l'email correspond (sécurité additionnelle)
      if (user.email !== payload.email) {
        this.logger.warn(`Mismatch email pour l'utilisateur ${payload.sub}`);
        throw new UnauthorizedException('Token invalide');
      }

      // Note: lockedUntil n'est pas inclus dans le select, on va l'ajouter si nécessaire
      // Cette vérification se fait plutôt au niveau du service d'authentification

      // Extraire les rôles et permissions
      const roles = user.roles.map(userRole => userRole.role.name);
      const permissions = this.extractPermissions(user.roles.map(ur => ur.role));

      // Construire l'objet utilisateur à retourner
      const authenticatedUser = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        phone: user.phone,
        avatar: user.avatar,
        status: user.status,
        emailVerified: user.emailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
        lastLoginAt: user.lastLoginAt,
        roles,
        permissions,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      // Log de debug pour le développement
      if (this.configService.get('app.debug')) {
        this.logger.debug(
          `Utilisateur authentifié: ${user.email} avec les rôles: ${roles.join(', ')}`
        );
      }

      return authenticatedUser;
    } catch (error) {
      this.logger.error('Erreur lors de la validation JWT:', error);
      throw new UnauthorizedException('Authentification échouée');
    }
  }

  /**
   * Extrait les permissions depuis les rôles de l'utilisateur
   */
  private extractPermissions(roles: any[]): string[] {
    const permissions = new Set<string>();

    roles.forEach(role => {
      if (role.permissions && typeof role.permissions === 'object') {
        Object.entries(role.permissions).forEach(([resource, actions]) => {
          if (Array.isArray(actions)) {
            actions.forEach(action => {
              permissions.add(`${resource}:${action}`);
            });
          }
        });
      }
    });

    return Array.from(permissions);
  }
}