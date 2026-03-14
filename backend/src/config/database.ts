/**
 * Configuración de la base de datos PostgreSQL
 */

import pkg from 'pg';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

const { Pool } = pkg;

export const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  logger.error('Error en pool de conexiones:', err);
});

pool.on('connect', () => {
  logger.info('Nueva conexión establecida a PostgreSQL');
});

export async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    logger.info('✓ Conexión a PostgreSQL exitosa');
    return true;
  } catch (err) {
    logger.error('✗ Error conectando a PostgreSQL:', err);
    return false;
  }
}
