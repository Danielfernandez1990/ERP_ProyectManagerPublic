/**
 * Configuración de Redis para sesiones y caché
 */

import { createClient } from 'redis';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

export const redisClient = createClient({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password || undefined,
  legacyMode: false,
});

redisClient.on('error', (err) => {
  logger.error('Error en Redis:', err);
});

redisClient.on('connect', () => {
  logger.info('✓ Conexión a Redis exitosa');
});

export async function connectRedis(): Promise<void> {
  try {
    await redisClient.connect();
  } catch (err) {
    logger.error('Error conectando a Redis:', err);
    throw err;
  }
}

export async function disconnectRedis(): Promise<void> {
  await redisClient.quit();
}
