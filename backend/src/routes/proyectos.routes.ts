/**
 * Rutas de Proyectos
 * GET /api/proyectos - Listar todos
 * GET /api/proyectos/:id - Obtener uno
 * POST /api/proyectos - Crear
 * PUT /api/proyectos/:id - Actualizar
 * DELETE /api/proyectos/:id - Eliminar (marcar como cancelado)
 */

import { Router } from 'express';
import {
  getProyectos,
  getProyecto,
  createProyecto,
  updateProyecto,
  deleteProyecto,
} from '../controllers/proyectosController.js';
import { verifyAuthToken } from '../middleware/auth.js';

const router = Router();

router.use(verifyAuthToken);

/**
 * GET /api/proyectos
 * Query params: page=1, limit=10, estado=PENDIENTE
 */
router.get('/', getProyectos);

/**
 * GET /api/proyectos/:id
 */
router.get('/:id', getProyecto);

/**
 * POST /api/proyectos
 * Body: { "codigo", "nombre", "cliente_id", "descripcion", "fecha_inicio", "fecha_fin_estimada" }
 */
router.post('/', createProyecto);

/**
 * PUT /api/proyectos/:id
 */
router.put('/:id', updateProyecto);

/**
 * DELETE /api/proyectos/:id
 */
router.delete('/:id', deleteProyecto);

export default router;
