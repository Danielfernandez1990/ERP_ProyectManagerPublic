/**
 * Middleware de logging de requests
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 400 ? 'warn' : 'info';
    
    logger[level as 'info' | 'warn'](
      `${req.method} ${req.originalUrl} - ${res.statusCode} ${duration}ms`
    );
  });

  next();
}
