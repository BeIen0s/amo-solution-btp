import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Récupérer les rôles requis depuis les métadonnées
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Récupérer les permissions requises depuis les métadonnées
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>('permissions', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si aucun rôle ni permission n'est requis, autoriser l'accès
    if (!requiredRoles && !requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    if (!user) {
      this.logger.warn('Tentative d\'accès sans utilisateur authentifié');
      throw new ForbiddenException('Utilisateur non authentifié');
    }

    // Récupérer l'utilisateur complet avec ses rôles et permissions
    const fullUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!fullUser) {
      this.logger.warn(`Utilisateur ${user.id} non trouvé dans la base de données`);
      throw new ForbiddenException('Utilisateur non valide');
    }

    const userRoles = fullUser.roles.map(userRole => userRole.role.name);
    const userPermissions = this.extractPermissions(fullUser.roles.map(ur => ur.role));

    // Vérification des rôles
    if (requiredRoles) {
      const hasRole = requiredRoles.some(role => userRoles.includes(role));
      if (!hasRole) {
        this.logger.warn(
          `Accès refusé pour ${user.email} - Rôles requis: ${requiredRoles.join(', ')}, Rôles utilisateur: ${userRoles.join(', ')}`
        );
        throw new ForbiddenException('Rôle insuffisant pour accéder à cette ressource');
      }
    }

    // Vérification des permissions
    if (requiredPermissions) {
      const hasPermission = requiredPermissions.some(permission => 
        userPermissions.includes(permission)
      );
      if (!hasPermission) {
        this.logger.warn(
          `Accès refusé pour ${user.email} - Permissions requises: ${requiredPermissions.join(', ')}`
        );
        throw new ForbiddenException('Permissions insuffisantes pour accéder à cette ressource');
      }
    }

    this.logger.debug(
      `Accès autorisé pour ${user.email} avec les rôles: ${userRoles.join(', ')}`
    );

    return true;
  }

  /**
   * Extrait toutes les permissions depuis les rôles de l'utilisateur
   */
  private extractPermissions(roles: any[]): string[] {
    const permissions = new Set<string>();

    roles.forEach(role => {
      if (role.permissions && typeof role.permissions === 'object') {
        // Les permissions sont stockées comme un objet JSON
        // Exemple: { "users": ["create", "read"], "clients": ["read", "update"] }
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