import { SetMetadata, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// ===== DÉCORATEUR ROUTES PUBLIQUES =====
/**
 * Marque une route comme publique (pas d'authentification requise)
 */
export const Public = () => SetMetadata('isPublic', true);

// ===== DÉCORATEUR RÔLES =====
/**
 * Définit les rôles requis pour accéder à une route
 * @param roles Liste des rôles autorisés
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// ===== DÉCORATEUR PERMISSIONS =====
/**
 * Définit les permissions requises pour accéder à une route
 * @param permissions Liste des permissions requises (format: "resource:action")
 */
export const Permissions = (...permissions: string[]) => SetMetadata('permissions', permissions);

// ===== DÉCORATEUR UTILISATEUR ACTUEL =====
/**
 * Récupère l'utilisateur authentifié depuis le contexte de la requête
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user;
  },
);

// ===== DÉCORATEUR ID UTILISATEUR =====
/**
 * Récupère l'ID de l'utilisateur authentifié
 */
export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user?.['id'];
  },
);

// ===== DÉCORATEUR EMAIL UTILISATEUR =====
/**
 * Récupère l'email de l'utilisateur authentifié
 */
export const UserEmail = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user?.['email'];
  },
);

// ===== DÉCORATEUR RÔLES UTILISATEUR =====
/**
 * Récupère les rôles de l'utilisateur authentifié
 */
export const UserRoles = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user?.['roles'] || [];
  },
);

// ===== DÉCORATEUR IP CLIENT =====
/**
 * Récupère l'adresse IP du client
 */
export const ClientIp = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.ip || 
           request.connection?.remoteAddress || 
           request.socket?.remoteAddress || 
           (request.connection as any)?.socket?.remoteAddress ||
           request.headers['x-forwarded-for'] ||
           request.headers['x-real-ip'];
  },
);

// ===== DÉCORATEUR USER AGENT =====
/**
 * Récupère le User-Agent du client
 */
export const UserAgent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.headers['user-agent'];
  },
);

// ===== DÉCORATEUR POUR LES SUPER ADMINS =====
/**
 * Restreint l'accès aux super administrateurs uniquement
 */
export const SuperAdminOnly = () => Roles('SUPER_ADMIN');

// ===== DÉCORATEUR POUR LES ADMINS =====
/**
 * Restreint l'accès aux administrateurs (ADMIN et SUPER_ADMIN)
 */
export const AdminOnly = () => Roles('ADMIN', 'SUPER_ADMIN');

// ===== DÉCORATEURS POUR LES PERMISSIONS COMMUNES =====
/**
 * Permission de lecture des utilisateurs
 */
export const CanReadUsers = () => Permissions('users:read');

/**
 * Permission de création des utilisateurs
 */
export const CanCreateUsers = () => Permissions('users:create');

/**
 * Permission de modification des utilisateurs
 */
export const CanUpdateUsers = () => Permissions('users:update');

/**
 * Permission de suppression des utilisateurs
 */
export const CanDeleteUsers = () => Permissions('users:delete');

/**
 * Permission de lecture des clients
 */
export const CanReadClients = () => Permissions('clients:read');

/**
 * Permission de création des clients
 */
export const CanCreateClients = () => Permissions('clients:create');

/**
 * Permission de modification des clients
 */
export const CanUpdateClients = () => Permissions('clients:update');

/**
 * Permission de suppression des clients
 */
export const CanDeleteClients = () => Permissions('clients:delete');

/**
 * Permission de gestion des devis
 */
export const CanManageQuotes = () => Permissions('devis:create', 'devis:update', 'devis:delete');

/**
 * Permission de gestion des factures
 */
export const CanManageInvoices = () => Permissions('factures:create', 'factures:update', 'factures:delete');

/**
 * Permission de lecture des logs d'audit
 */
export const CanReadAuditLogs = () => Permissions('auditLogs:read');

// ===== DÉCORATEUR COMBINÉ =====
/**
 * Combine plusieurs décorateurs d'autorisation
 */
export const RequireAuth = (options: {
  roles?: string[];
  permissions?: string[];
}) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    if (options.roles) {
      Roles(...options.roles)(target, propertyKey, descriptor);
    }
    if (options.permissions) {
      Permissions(...options.permissions)(target, propertyKey, descriptor);
    }
  };
};