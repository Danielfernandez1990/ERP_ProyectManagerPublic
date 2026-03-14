/**
 * Rutas de Usuarios
 * GET /api/usuarios - Listar todos
 * GET /api/usuarios/:id - Obtener uno
 * POST /api/usuarios - Crear
 * PUT /api/usuarios/:id - Actualizar
 * DELETE /api/usuarios/:id - Eliminar
 * PUT /api/usuarios/:id/password - Cambiar contraseña
 */

import { Router } from 'express';
import {
  getUsuarios,
  getUsuario,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  changePassword,
} from '../controllers/usuariosController.js';
import { verifyAuthToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Todos los endpoints requieren autenticación
router.use(verifyAuthToken);

/**
 * GET /api/usuarios
 * Lista todos los usuarios con paginación
 * Query params: page=1, limit=10
 */
router.get('/', getUsuarios);

/**
 * GET /api/usuarios/:id
 * Obtiene un usuario específico
 */
router.get('/:id', getUsuario);

/**
 * POST /api/usuarios
 * Crea un nuevo usuario (Solo SUPER_ADMIN)
 * Body:
 * {
 *   "nombre": "Juan",
 *   "email": "juan@example.com",
 *   "password": "SecurePass123!",
 *   "rol": "ADMIN",
 *   "departamento": "Ventas"
 * }
 */
router.post('/', requireRole('SUPER_ADMIN'), createUsuario);

/**
 * PUT /api/usuarios/:id
 * Actualiza un usuario (Solo SUPER_ADMIN)
 * Body: { "nombre", "email", "rol", "departamento", "activo" }
 */
router.put('/:id', requireRole('SUPER_ADMIN'), updateUsuario);

/**
 * DELETE /api/usuarios/:id
 * Elimina un usuario (Solo SUPER_ADMIN)
 * Nota: Es soft delete (marca como inactivo)
 */
router.delete('/:id', requireRole('SUPER_ADMIN'), deleteUsuario);

/**
 * PUT /api/usuarios/:id/password
 * Cambia contraseña del usuario
 * Body: { "newPassword": "NewPass123!" }
 */
router.put('/:id/password', changePassword);

export default router;
