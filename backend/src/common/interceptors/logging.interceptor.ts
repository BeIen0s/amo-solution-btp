import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, ip, headers } = request;
    
    const userAgent = headers['user-agent'] || '';
    const userId = request.user?.['id'] || 'anonymous';
    
    const now = Date.now();
    
    // Log de la requête entrante
    this.logger.log(
      `🔄 ${method} ${url} - User: ${userId} - IP: ${ip} - UA: ${userAgent}`
    );

    return next.handle().pipe(
      tap(() => {
        const { statusCode } = response;
        const duration = Date.now() - now;
        
        // Log de la réponse
        this.logger.log(
          `✅ ${method} ${url} - ${statusCode} - ${duration}ms - User: ${userId}`
        );
      }),
    );
  }
}