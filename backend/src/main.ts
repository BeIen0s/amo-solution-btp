import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';

import { AppModule } from './app.module';
import { PrismaService } from './common/services/prisma.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const prismaService = app.get(PrismaService);
  const logger = new Logger('Bootstrap');

  // Configuration de base
  const port = configService.get('PORT') || 3001;
  const nodeEnv = configService.get('NODE_ENV') || 'development';
  const corsOrigin = configService.get('CORS_ORIGIN') || 'http://localhost:5173';

  // Middleware de sécurité
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        imgSrc: ['self', 'data:', 'https:'],
        scriptSrc: ['self'],
        styleSrc: ['self', 'unsafe-inline'],
      },
    },
  }));

  // Compression
  app.use(compression());

  // Cookie parser
  app.use(cookieParser());

  // CORS
  app.use(cors({
    origin: corsOrigin.split(',').map(origin => origin.trim()),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }));

  // Préfixe global pour l'API
  app.setGlobalPrefix('api/v1');

  // Validation globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Intercepteurs globaux
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new AuditInterceptor(),
  );

  // Configuration Swagger en développement
  if (nodeEnv === 'development') {
    const config = new DocumentBuilder()
      .setTitle('A.M.O Solution BTP API')
      .setDescription('API pour l\'application A.M.O Solution BTP - Gestion modulaire pour le secteur BTP')
      .setVersion('1.0')
      .addBearerAuth(
        {
          description: 'Token JWT pour l\'authentification',
          name: 'Authorization',
          bearerFormat: 'Bearer',
          scheme: 'Bearer',
          type: 'http',
          in: 'Header',
        },
        'JWT-auth',
      )
      .addTag('Auth', 'Authentification et autorisation')
      .addTag('Users', 'Gestion des utilisateurs')
      .addTag('Clients', 'Gestion des clients')
      .addTag('Devis', 'Gestion des devis')
      .addTag('Factures', 'Gestion des factures')
      .addTag('Commandes', 'Gestion des commandes')
      .addTag('Stock', 'Gestion du stock')
      .addTag('Interventions', 'Gestion des interventions')
      .addTag('Documents', 'Gestion documentaire')
      .addTag('Admin', 'Administration système')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    logger.log(`📚 Documentation API disponible sur http://localhost:${port}/api/docs`);
  }

  // Gestion graceful shutdown
  process.on('SIGINT', async () => {
    logger.log('🛑 Signal SIGINT reçu, arrêt en cours...');
    await prismaService.$disconnect();
    await app.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    logger.log('🛑 Signal SIGTERM reçu, arrêt en cours...');
    await prismaService.$disconnect();
    await app.close();
    process.exit(0);
  });

  // Endpoint de santé
  app.use('/health', (req, res) => {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0',
    });
  });

  // Démarrage du serveur
  await app.listen(port);
  
  logger.log(`🚀 Application démarrée sur http://localhost:${port}`);
  logger.log(`🌍 Environnement: ${nodeEnv}`);
  logger.log(`🔐 CORS configuré pour: ${corsOrigin}`);
  
  if (nodeEnv === 'development') {
    logger.log(`🔍 Prisma Studio: npx prisma studio`);
  }
}

bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('❌ Erreur lors du démarrage de l\'application:', error);
  process.exit(1);
});