/**
 * Logger centralizado con Winston
 */

import winston from 'winston';
import { config } from '../config/env.js';
import fs from 'fs';
import path from 'path';

// Crear directorio de logs si no existe
if (!fs.existsSync(config.logging.dir)) {
  fs.mkdirSync(config.logging.dir, { recursive: true });
}

export const logger = winston.createLogger({
  level: config.logging.level,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'erp-v3-api' },
  transports: [
    // Logs en archivo
    new winston.transports.File({
      filename: path.join(config.logging.dir, 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(config.logging.dir, 'combined.log'),
    }),
  ],
});

// Logs en consola en desarrollo
if (config.nodeEnv !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp }) => {
          return `${timestamp} [${level}]: ${message}`;
        })
      ),
    })
  );
}
