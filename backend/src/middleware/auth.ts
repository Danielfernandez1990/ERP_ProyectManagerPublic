/**
 * Middleware de Autenticación
 * Verifica JWT en headers Authorization
 */

import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt.js';
import { logger } from '../utils/logger.js';

// Extender tipo Request para incluir usuario
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Middleware para verificar token JWT
 * Uso: app.use(verifyAuthToken) o app.get('/ruta', verifyAuthToken, handler)
 */
export function verifyAuthToken(req: Request, res: Response, next: NextFunction): void {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ 
        error: 'Token no proporcionado',
        message: 'Se requiere autenticación'
      });
      return;
    }

    // Extraer token
    const token = authHeader.substring(7); // Remover "Bearer "

    // Verificar token
    const payload = verifyToken(token);
    
    // Adjuntar usuario al request
    req.user = payload;
    
    logger.info(`✓ Token verificado para usuario: ${payload.email}`);
    next();
  } catch (err) {
    logger.error('Error verificando token:', err);
    res.status(401).json({ 
      error: 'Token inválido o expirado',
      message: 'Por favor inicia sesión nuevamente'
    });
  }
}

/**
 * Middleware para verificar que el usuario tiene un rol específico
 * Uso: app.get('/ruta', verifyAuthToken, requireRole('ADMIN'), handler)
 */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    if (!roles.includes(req.user.rol)) {
      logger.warn(`Acceso denegado para usuario ${req.user.email} - Rol requerido: ${roles.join(', ')}`);
      res.status(403).json({ 
        error: 'Permiso denegado',
        message: `Se requiere uno de estos roles: ${roles.join(', ')}`
      });
      return;
    }

    logger.info(`✓ Autorización correcta para ${req.user.email} - Rol: ${req.user.rol}`);
    next();
  };
}

/**
 * Middleware para verificar Super Admin
 * Uso: app.get('/ruta', verifyAuthToken, requireSuperAdmin, handler)
 */
export function requireSuperAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'No autenticado' });
    return;
  }

  if (req.user.rol !== 'SUPER_ADMIN') {
    logger.warn(`Acceso Super Admin denegado para ${req.user.email}`);
    res.status(403).json({ 
      error: 'Permiso denegado',
      message: 'Solo Super Admins pueden acceder'
    });
    return;
  }

  next();
}

/**
 * Middleware para logging de acceso autenticado
 * Registra quién accede a qué y cuándo
 */
export function logAuthenticatedAccess(req: Request, res: Response, next: NextFunction): void {
  if (req.user) {
    const originalSend = res.send;
    
    res.send = function(data: any) {
      logger.info(`[${req.user?.rol}] ${req.user?.email} - ${req.method} ${req.path} - Status: ${res.statusCode}`);
      return originalSend.call(this, data);
    };
  }
  
  next();
}
