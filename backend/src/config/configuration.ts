import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

// Schéma de validation pour les variables d'environnement
export const configValidationSchema = Joi.object({
  // Environnement
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3001),
  
  // URLs
  FRONTEND_URL: Joi.string().required(),
  BACKEND_URL: Joi.string().required(),
  
  // Base de données
  DATABASE_URL: Joi.string().required(),
  
  // Redis
  REDIS_URL: Joi.string().required(),
  REDIS_PASSWORD: Joi.string().allow(''),
  
  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_EXPIRE_TIME: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRE_TIME: Joi.string().default('7d'),
  
  // 2FA
  TOTP_SERVICE_NAME: Joi.string().default('A.M.O Solution BTP'),
  TOTP_ISSUER: Joi.string().default('amo-solution-btp.com'),
  
  // Chiffrement
  ENCRYPTION_KEY: Joi.string().min(32).required(),
  
  // Email
  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.number().default(587),
  SMTP_SECURE: Joi.boolean().default(false),
  SMTP_USER: Joi.string().required(),
  SMTP_PASS: Joi.string().required(),
  SMTP_FROM: Joi.string().required(),
  
  // Stockage (MinIO/S3)
  MINIO_ENDPOINT: Joi.string(),
  MINIO_PORT: Joi.number(),
  MINIO_ACCESS_KEY: Joi.string(),
  MINIO_SECRET_KEY: Joi.string(),
  MINIO_BUCKET: Joi.string(),
  MINIO_USE_SSL: Joi.boolean().default(false),
  
  AWS_ACCESS_KEY_ID: Joi.string(),
  AWS_SECRET_ACCESS_KEY: Joi.string(),
  AWS_REGION: Joi.string(),
  AWS_S3_BUCKET: Joi.string(),
  
  // Sécurité
  THROTTLE_TTL: Joi.number().default(60),
  THROTTLE_LIMIT: Joi.number().default(100),
  CORS_ORIGIN: Joi.string().required(),
  
  // Webhooks
  WEBHOOK_SECRET: Joi.string(),
  
  // Logs
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug')
    .default('info'),
  
  // Feature flags
  FEATURE_FLAG_OVERRIDE: Joi.boolean().default(false),
  
  // Debug
  DEBUG: Joi.boolean().default(false),
  PRISMA_DEBUG: Joi.boolean().default(false),
});

// Configuration de la base de données
export const databaseConfig = registerAs('database', () => ({
  url: process.env.DATABASE_URL,
  debug: process.env.PRISMA_DEBUG === 'true',
}));

// Configuration JWT
export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  expiresIn: process.env.JWT_EXPIRE_TIME || '15m',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE_TIME || '7d',
}));

// Configuration Redis
export const redisConfig = registerAs('redis', () => ({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
}));

// Configuration Email
export const emailConfig = registerAs('email', () => ({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  from: process.env.SMTP_FROM,
}));

// Configuration du stockage
export const storageConfig = registerAs('storage', () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    return {
      provider: 'aws',
      aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
        bucket: process.env.AWS_S3_BUCKET,
      },
    };
  }
  
  return {
    provider: 'minio',
    minio: {
      endpoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: parseInt(process.env.MINIO_PORT) || 9000,
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
      bucket: process.env.MINIO_BUCKET || 'amo-documents',
    },
  };
});

// Configuration 2FA
export const twoFactorConfig = registerAs('twoFactor', () => ({
  serviceName: process.env.TOTP_SERVICE_NAME || 'A.M.O Solution BTP',
  issuer: process.env.TOTP_ISSUER || 'amo-solution-btp.com',
}));

// Configuration de sécurité
export const securityConfig = registerAs('security', () => ({
  encryptionKey: process.env.ENCRYPTION_KEY,
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL) || 60,
    limit: parseInt(process.env.THROTTLE_LIMIT) || 100,
  },
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',').map(o => o.trim()) || ['http://localhost:5173'],
  },
}));

// Configuration générale de l'application
export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT) || 3001,
  frontendUrl: process.env.FRONTEND_URL,
  backendUrl: process.env.BACKEND_URL,
  logLevel: process.env.LOG_LEVEL || 'info',
  debug: process.env.DEBUG === 'true',
}));

// Configuration des webhooks
export const webhookConfig = registerAs('webhook', () => ({
  secret: process.env.WEBHOOK_SECRET,
}));

// Configuration des feature flags
export const featureFlagConfig = registerAs('featureFlag', () => ({
  override: process.env.FEATURE_FLAG_OVERRIDE === 'true',
}));