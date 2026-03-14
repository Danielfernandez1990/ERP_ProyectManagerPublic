/**
 * Punto de entrada de la aplicación
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/env.js';
import { testConnection } from './config/database.js';
import { connectRedis } from './config/redis.js';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';
import authRoutes from './routes/auth.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import clientesRoutes from './routes/clientes.routes.js';
import productosRoutes from './routes/productos.routes.js';
import proyectosRoutes from './routes/proyectos.routes.js';
import tareasRoutes from './routes/tareas.routes.js';

const app = express();

// ===== Middleware de seguridad =====
app.use(helmet());
app.use(cors({
  origin: config.api.frontendUrl,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 requests por ventana
  message: 'Demasiadas solicitudes desde esta IP',
});
app.use(limiter);

// ===== Body parsers =====
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ===== Logging =====
app.use(requestLogger);

// ===== Rutas de Salud =====
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ===== Rutas de API =====
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/proyectos', proyectosRoutes);
app.use('/api/tareas', tareasRoutes);

// ===== Documentación de endpoints =====
app.get('/api', (req, res) => {
  res.json({ 
    message: 'ERP V3.0 API',
    version: '3.0.0',
    endpoints: {
      auth: '/api/auth (POST login, logout, refresh, register)',
      usuarios: '/api/usuarios (CRUD)',
      clientes: '/api/clientes (CRUD)',
      productos: '/api/productos (CRUD)',
      proyectos: '/api/proyectos (CRUD)',
      tareas: '/api/tareas (CRUD + Kanban)',
      licencias: '/api/licencias (Por implementar)',
      integraciones: '/api/integraciones (Por implementar)',
      admin: '/api/admin (Por implementar)',
    }
  });
});

// ===== Error handling =====
app.use(errorHandler);

// ===== Inicialización =====
async function start() {
  try {
    // Conectar a base de datos
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('No se pudo conectar a la base de datos');
    }

    // Conectar a Redis
    await connectRedis();

    // Iniciar servidor
    app.listen(config.port, () => {
      logger.info(`🚀 Servidor iniciado en puerto ${config.port} (${config.nodeEnv})`);
    });
  } catch (err) {
    logger.error('Error iniciando servidor:', err);
    process.exit(1);
  }
}

start();

export default app;
