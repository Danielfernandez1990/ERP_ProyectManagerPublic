/**
 * Configuración de variables de entorno
 * Este archivo centraliza todas las variables de entorno
 */

import dotenv from 'dotenv';
import path from 'path';

// Cargar .env
dotenv.config();

export const config = {
  // App
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000'),
  
  // Database
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'erpadmin',
    password: process.env.DB_PASSWORD || 'changeme123!',
    database: process.env.DB_NAME || 'erp_v3',
  },
  
  // Redis
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || '',
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    expiry: process.env.JWT_EXPIRY || '7d',
  },
  
  // Encryption
  encryption: {
    key: process.env.ENCRYPTION_KEY || 'your-encryption-key-32-chars-min',
    iv: process.env.IV || 'your-initialization-vector',
  },
  
  // API
  api: {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3000/api',
  },
  
  // Email
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    from: process.env.SMTP_FROM || 'noreply@tuempresa.com',
  },
  
  // Integraciones
  integrations: {
    syncInterval: parseInt(process.env.SYNC_INTERVAL || '300000'),
    enableTelemetry: process.env.ENABLE_TELEMETRY === 'true',
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    dir: process.env.LOG_DIR || './logs',
  },
};
