/**
 * Rutas de Autenticación
 * POST /api/auth/login - Login
 * POST /api/auth/logout - Logout
 * POST /api/auth/refresh - Refrescar token
 * POST /api/auth/register - Registrar usuario (Solo Super Admin)
 * GET /api/auth/me - Obtener usuario actual
 */

import { Router } from 'express';
import {
  login,
  logout,
  refresh,
  register,
  getMe,
} from '../controllers/authController.js';
import { verifyAuthToken, requireRole } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/auth/login
 * Autentica usuario con email y contraseña
 * 
 * Body:
 * {
 *   "email": "usuario@example.com",
 *   "password": "password123"
 * }
 * 
 * Response (200):
 * {
 *   "message": "Login exitoso",
 *   "token": "eyJhbGc...",
 *   "usuario": {
 *     "id": "uuid",
 *     "email": "usuario@example.com",
 *     "nombre": "Juan",
 *     "rol": "ADMIN"
 *   }
 * }
 */
router.post('/login', login);

/**
 * POST /api/auth/logout
 * Cierra sesión del usuario autenticado
 * 
 * Headers:
 * Authorization: Bearer <token>
 */
router.post('/logout', verifyAuthToken, logout);

/**
 * POST /api/auth/refresh
 * Refresca un token JWT expirado
 * 
 * Headers:
 * Authorization: Bearer <token>
 * 
 * Response (200):
 * {
 *   "message": "Token refrescado",
 *   "token": "eyJhbGc..."
 * }
 */
router.post('/refresh', verifyAuthToken, refresh);

/**
 * POST /api/auth/register
 * Registra un nuevo usuario (Solo Super Admin)
 * 
 * Headers:
 * Authorization: Bearer <token>
 * 
 * Body:
 * {
 *   "nombre": "Juan Pérez",
 *   "email": "juan@example.com",
 *   "password": "SecurePassword123!",
 *   "rol": "ADMIN",
 *   "departamento": "Ventas"
 * }
 * 
 * Response (201):
 * {
 *   "message": "Usuario registrado exitosamente",
 *   "usuario": {
 *     "id": "uuid",
 *     "nombre": "Juan Pérez",
 *     "email": "juan@example.com",
 *     "rol": "ADMIN"
 *   }
 * }
 */
router.post('/register', verifyAuthToken, requireRole('SUPER_ADMIN'), register);

/**
 * GET /api/auth/me
 * Obtiene información del usuario autenticado
 * 
 * Headers:
 * Authorization: Bearer <token>
 * 
 * Response (200):
 * {
 *   "usuario": {
 *     "id": "uuid",
 *     "nombre": "Juan",
 *     "email": "juan@example.com",
 *     "rol": "ADMIN",
 *     "ultimo_login": "2026-03-14T15:30:00Z"
 *   }
 * }
 */
router.get('/me', verifyAuthToken, getMe);

export default router;
