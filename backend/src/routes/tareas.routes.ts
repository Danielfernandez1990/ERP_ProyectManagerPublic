/**
 * Rutas de Tareas (Kanban)
 * GET /api/tareas - Listar todas
 * GET /api/tareas/:id - Obtener una
 * GET /api/tareas/proyecto/:proyecto_id - Kanban view
 * POST /api/tareas - Crear
 * PUT /api/tareas/:id - Actualizar
 * DELETE /api/tareas/:id - Eliminar
 */

import { Router } from 'express';
import {
  getTareas,
  getTarea,
  createTarea,
  updateTarea,
  deleteTarea,
  getTareasPorProyecto,
} from '../controllers/tareasController.js';
import { verifyAuthToken } from '../middleware/auth.js';

const router = Router();

router.use(verifyAuthToken);

/**
 * GET /api/tareas/proyecto/:proyecto_id
 * Kanban board por proyecto
 * NOTA: Esta ruta debe estar ANTES de /:id para evitar conflicto
 */
router.get('/proyecto/:proyecto_id', getTareasPorProyecto);

/**
 * GET /api/tareas
 * Query params: page=1, limit=20, proyecto_id=xxx, estado=PENDIENTE
 */
router.get('/', getTareas);

/**
 * GET /api/tareas/:id
 */
router.get('/:id', getTarea);

/**
 * POST /api/tareas
 * Body: { "codigo", "titulo", "descripcion", "proyecto_id", "prioridad", "asignado_a", "fecha_vencimiento" }
 */
router.post('/', createTarea);

/**
 * PUT /api/tareas/:id
 */
router.put('/:id', updateTarea);

/**
 * DELETE /api/tareas/:id
 */
router.delete('/:id', deleteTarea);

export default router;
