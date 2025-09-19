import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { PrismaService } from '../services/prisma.service';
import { LogLevel } from '@prisma/client';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, ip, headers, body, params, query } = request;
    
    // Ne pas auditer certaines routes
    const skipAuditPaths = [
      '/health',
      '/api/docs',
      '/favicon.ico',
    ];
    
    if (skipAuditPaths.some(path => url.includes(path))) {
      return next.handle();
    }

    const userId = request.user?.['id'] || null;
    const userAgent = headers['user-agent'] || '';
    
    // Déterminer l'action et l'entité depuis l'URL
    const { action, entity, entityId } = this.parseUrlForAudit(url, method);
    
    // Filtrer les données sensibles
    const sanitizedBody = this.sanitizeData(body);
    const sanitizedQuery = this.sanitizeData(query);
    const sanitizedParams = this.sanitizeData(params);

    return next.handle().pipe(
      tap(async (responseData) => {
        try {
          // Ne pas auditer les requêtes GET sauf pour les entités importantes
          if (method === 'GET' && !this.shouldAuditRead(entity)) {
            return;
          }

          await this.prisma.auditLog.create({
            data: {
              action,
              entity,
              entityId,
              oldValues: null, // TODO: Implémenter la récupération des anciennes valeurs
              newValues: {
                method,
                url,
                body: sanitizedBody,
                params: sanitizedParams,
                query: sanitizedQuery,
                responseStatus: 'success',
                timestamp: new Date().toISOString(),
              },
              ipAddress: ip,
              userAgent,
              userId,
              level: this.determineLogLevel(method, action),
            },
          });
        } catch (error) {
          // Ne pas faire échouer la requête si l'audit échoue
          console.error('Erreur lors de l\'audit:', error);
        }
      }),
    );
  }

  private parseUrlForAudit(url: string, method: string): {
    action: string;
    entity: string;
    entityId?: string;
  } {
    // Supprimer le préfixe API
    const cleanUrl = url.replace('/api/v1/', '');
    const segments = cleanUrl.split('/').filter(Boolean);
    
    if (segments.length === 0) {
      return { action: 'UNKNOWN', entity: 'system' };
    }

    const entity = segments[0].toUpperCase();
    let action = method.toUpperCase();
    let entityId: string | undefined;

    // Mapper les méthodes HTTP vers des actions métier
    switch (method) {
      case 'POST':
        action = 'CREATE';
        break;
      case 'PUT':
      case 'PATCH':
        action = 'UPDATE';
        entityId = segments[1];
        break;
      case 'DELETE':
        action = 'DELETE';
        entityId = segments[1];
        break;
      case 'GET':
        action = segments.length > 1 ? 'READ' : 'list';
        if (segments.length > 1) {
          entityId = segments[1];
        }
        break;
    }

    // Actions spéciales
    if (cleanUrl.includes('/login')) {
      action = 'LOGIN';
      entity = 'AUTH';
    } else if (cleanUrl.includes('/logout')) {
      action = 'LOGOUT';
      entity = 'AUTH';
    } else if (cleanUrl.includes('/password')) {
      action = 'PASSWORD_CHANGE';
      entity = 'AUTH';
    }

    return { action, entity, entityId };
  }

  private sanitizeData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const sensitiveFields = [
      'password',
      'token',
      'secret',
      'key',
      'authorization',
      'cookie',
    ];

    const sanitized = { ...data };
    
    for (const field of Object.keys(sanitized)) {
      if (sensitiveFields.some(sensitive => 
        field.toLowerCase().includes(sensitive)
      )) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  private shouldAuditRead(entity: string): boolean {
    const criticalEntities = [
      'USERS',
      'ADMIN',
      'AUDIT',
      'ROLES',
      'SYSTEM',
    ];

    return criticalEntities.includes(entity);
  }

  private determineLogLevel(method: string, action: string): LogLevel {
    // Actions critiques
    if (['DELETE', 'LOGIN', 'LOGOUT', 'PASSWORD_CHANGE'].includes(action)) {
      return LogLevel.WARNING;
    }

    // Actions de modification
    if (['CREATE', 'UPDATE'].includes(action)) {
      return LogLevel.INFO;
    }

    // Actions de lecture
    return LogLevel.INFO;
  }
}