/**
 * Rutas de Productos
 * GET /api/productos - Listar todos (con filtros)
 * GET /api/productos/:id - Obtener uno
 * POST /api/productos - Crear
 * PUT /api/productos/:id - Actualizar
 * DELETE /api/productos/:id - Eliminar
 */

import { Router } from 'express';
import {
  getProductos,
  getProducto,
  createProducto,
  updateProducto,
  deleteProducto,
} from '../controllers/productosController.js';
import { verifyAuthToken } from '../middleware/auth.js';

const router = Router();

router.use(verifyAuthToken);

/**
 * GET /api/productos
 * Query params: page=1, limit=10, categoria=electronics
 */
router.get('/', getProductos);

/**
 * GET /api/productos/:id
 */
router.get('/:id', getProducto);

/**
 * POST /api/productos
 * Body: { "sku", "nombre", "categoria", "precio", "stock", "stock_minimo", "descripcion" }
 */
router.post('/', createProducto);

/**
 * PUT /api/productos/:id
 */
router.put('/:id', updateProducto);

/**
 * DELETE /api/productos/:id
 */
router.delete('/:id', deleteProducto);

export default router;
