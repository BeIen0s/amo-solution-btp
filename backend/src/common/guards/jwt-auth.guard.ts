import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Vérifier si la route est marquée comme publique
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    
    if (err || !user) {
      const errorMessage = info?.message || 'Token invalide';
      this.logger.warn(
        `Accès non autorisé à ${request.method} ${request.url} - ${errorMessage}`
      );
      throw err || new UnauthorizedException(errorMessage);
    }

    // Ajouter l'utilisateur au contexte de la requête
    request.user = user;
    
    this.logger.debug(
      `Utilisateur authentifié: ${user.email} accède à ${request.method} ${request.url}`
    );

    return user;
  }
}