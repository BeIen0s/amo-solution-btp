import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('DATABASE_URL'),
        },
      },
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
    });

    // Configuration des logs en développement
    if (configService.get('NODE_ENV') === 'development') {
      this.$on('query', (e: any) => {
        this.logger.debug(`Query: ${e.query}`);
        this.logger.debug(`Params: ${e.params}`);
        this.logger.debug(`Duration: ${e.duration}ms`);
      });
    }

    this.$on('error', (e: any) => {
      this.logger.error('Prisma Error:', e);
    });

    this.$on('warn', (e: any) => {
      this.logger.warn('Prisma Warning:', e);
    });

    this.$on('info', (e: any) => {
      this.logger.log('Prisma Info:', e);
    });
  }

  async onModuleInit() {
    this.logger.log('🔌 Connexion à la base de données...');
    await this.$connect();
    this.logger.log('✅ Connecté à la base de données');
  }

  async onModuleDestroy() {
    this.logger.log('🔌 Fermeture de la connexion à la base de données...');
    await this.$disconnect();
    this.logger.log('✅ Connexion à la base de données fermée');
  }

  /**
   * Nettoie la base de données (utile pour les tests)
   */
  async cleanDatabase() {
    if (this.configService.get('NODE_ENV') === 'production') {
      throw new Error('Ne peut pas nettoyer la base de données en production');
    }

    const tablenames = await this.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename FROM pg_tables WHERE schemaname='public'
    `;

    const tables = tablenames
      .map(({ tablename }) => tablename)
      .filter((name) => name !== '_prisma_migrations')
      .map((name) => `"public"."${name}"`)
      .join(', ');

    try {
      await this.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
    } catch (error) {
      this.logger.error('Erreur lors du nettoyage de la base de données:', error);
    }
  }

  /**
   * Vérifie la santé de la base de données
   */
  async isHealthy(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.error('Base de données non disponible:', error);
      return false;
    }
  }
}