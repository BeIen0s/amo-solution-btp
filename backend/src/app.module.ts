import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

// Configuration
import {
  configValidationSchema,
  databaseConfig,
  jwtConfig,
  redisConfig,
  emailConfig,
  storageConfig,
  twoFactorConfig,
  securityConfig,
  appConfig,
  webhookConfig,
  featureFlagConfig,
} from './config/configuration';

// Services communs
import { PrismaService } from './common/services/prisma.service';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

// Modules métier
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    // Configuration globale avec validation
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        jwtConfig,
        redisConfig,
        emailConfig,
        storageConfig,
        twoFactorConfig,
        securityConfig,
        appConfig,
        webhookConfig,
        featureFlagConfig,
      ],
      validationSchema: configValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),

    // Modules métier
    AuthModule,
  ],
  controllers: [],
  providers: [
    // Services globaux
    PrismaService,
    
    // Guards globaux
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}