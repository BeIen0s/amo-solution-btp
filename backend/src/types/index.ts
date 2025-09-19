import { User } from '@prisma/client';

// ===== TYPES D'AUTHENTIFICATION =====
export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  phone?: string;
  avatar?: string;
  status: string;
  emailVerified?: Date;
  twoFactorEnabled: boolean;
  lastLoginAt?: Date;
  roles: string[];
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ===== EXTENSION DE L'INTERFACE REQUEST =====
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

// ===== TYPES DE RÉPONSES API =====
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    pages?: number;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface PaginationResult<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// ===== TYPES DE FILTRAGE =====
export interface BaseFilter {
  id?: string;
  createdAt?: {
    gte?: Date;
    lte?: Date;
  };
  updatedAt?: {
    gte?: Date;
    lte?: Date;
  };
}

// ===== TYPES MÉTIER =====
export interface ClientFilter extends BaseFilter {
  name?: string;
  email?: string;
  type?: string;
  isProspect?: boolean;
  subscriptionId?: string;
}

export interface DevisFilter extends BaseFilter {
  clientId?: string;
  chantierId?: string;
  status?: string;
  totalHT?: {
    gte?: number;
    lte?: number;
  };
  date?: {
    gte?: Date;
    lte?: Date;
  };
}

export interface FactureFilter extends BaseFilter {
  clientId?: string;
  chantierId?: string;
  status?: string;
  type?: string;
  totalHT?: {
    gte?: number;
    lte?: number;
  };
  dueDate?: {
    gte?: Date;
    lte?: Date;
  };
}

// ===== TYPES DE STOCKAGE =====
export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export interface UploadedFile {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  path: string;
  uploadedAt: Date;
  uploadedBy?: string;
}

// ===== TYPES D'AUDIT =====
export interface AuditContext {
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  action: string;
  entity: string;
  entityId?: string;
  oldValues?: any;
  newValues?: any;
}

// ===== TYPES DE FEATURE FLAGS =====
export interface FeatureFlagContext {
  userId?: string;
  subscriptionId?: string;
  userRoles?: string[];
}

// ===== TYPES DE NOTIFICATIONS =====
export interface NotificationData {
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  userId?: string;
  data?: any;
}

// ===== TYPES D'EMAIL =====
export interface EmailTemplate {
  to: string | string[];
  subject: string;
  template: string;
  context: Record<string, any>;
}

// ===== TYPES DE CONFIGURATION =====
export interface DatabaseConfig {
  url: string;
  debug: boolean;
}

export interface JwtConfig {
  secret: string;
  refreshSecret: string;
  expiresIn: string;
  refreshExpiresIn: string;
}

export interface RedisConfig {
  url: string;
  password?: string;
}

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

export interface StorageConfig {
  provider: 'minio' | 'aws';
  minio?: {
    endpoint: string;
    port: number;
    useSSL: boolean;
    accessKey: string;
    secretKey: string;
    bucket: string;
  };
  aws?: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucket: string;
  };
}

// ===== TYPES DE VALIDATION =====
export interface ValidationError {
  field: string;
  message: string;
  value: any;
}

// ===== TYPES D'EXPORT =====
export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  filters?: any;
  columns?: string[];
  includeHeaders?: boolean;
}

// ===== TYPES DE STATISTIQUES =====
export interface DashboardStats {
  totalClients: number;
  totalDevis: number;
  totalFactures: number;
  chiffreAffaires: number;
  devisPendingCount: number;
  facturesOverdueCount: number;
  recentActivities: any[];
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }>;
}

// ===== UTILITAIRES =====
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

export type Required<T> = {
  [P in keyof T]-?: T[P];
};

export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// Export pour utilisation externe
export * from '@prisma/client';