/**
 * Rutas de Clientes
 * GET /api/clientes - Listar todos
 * GET /api/clientes/:id - Obtener uno
 * POST /api/clientes - Crear
 * PUT /api/clientes/:id - Actualizar
 * DELETE /api/clientes/:id - Eliminar
 */

import { Router } from 'express';
import {
  getClientes,
  getCliente,
  createCliente,
  updateCliente,
  deleteCliente,
} from '../controllers/clientesController.js';
import { verifyAuthToken } from '../middleware/auth.js';

const router = Router();

// Todos requieren autenticación
router.use(verifyAuthToken);

/**
 * GET /api/clientes
 * Lista todos los clientes con paginación
 */
router.get('/', getClientes);

/**
 * GET /api/clientes/:id
 * Obtiene un cliente específico
 */
router.get('/:id', getCliente);

/**
 * POST /api/clientes
 * Crea un nuevo cliente
 * Body: { "nombre", "email", "telefono", "direccion", "ciudad", "ruc" }
 */
router.post('/', createCliente);

/**
 * PUT /api/clientes/:id
 * Actualiza un cliente
 */
router.put('/:id', updateCliente);

/**
 * DELETE /api/clientes/:id
 * Elimina un cliente (soft delete)
 */
router.delete('/:id', deleteCliente);

export default router;
