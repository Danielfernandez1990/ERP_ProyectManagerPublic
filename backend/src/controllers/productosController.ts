/**
 * Controlador de Productos
 * CRUD completo de productos
 */

import { Request, Response } from 'express';
import { pool } from '../config/database.js';
import { logger } from '../utils/logger.js';

/**
 * GET /api/productos
 * Lista todos los productos (con paginación y filtros)
 */
export async function getProductos(req: Request, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const categoria = req.query.categoria as string;

    let countQuery = 'SELECT COUNT(*) as total FROM productos WHERE activo = true';
    let query = `
      SELECT * FROM productos
      WHERE activo = true
    `;
    const params: any[] = [];

    if (categoria) {
      countQuery += ' AND categoria = $1';
      query += ' AND categoria = $1';
      params.push(categoria);
    }

    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);

    const countResult = await pool.query(countQuery, categoria ? [categoria] : []);
    const total = parseInt(countResult.rows[0].total);

    const result = await pool.query(query, [...params, limit, offset]);

    logger.info(`✓ Listado de productos: ${result.rows.length} registros`);

    res.status(200).json({
      productos: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (err) {
    logger.error('Error listando productos:', err);
    res.status(500).json({ error: 'Error en servidor' });
  }
}

/**
 * GET /api/productos/:id
 * Obtiene un producto específico
 */
export async function getProducto(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const query = 'SELECT * FROM productos WHERE id = $1 AND activo = true';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }

    res.status(200).json({ producto: result.rows[0] });
  } catch (err) {
    logger.error('Error obteniendo producto:', err);
    res.status(500).json({ error: 'Error en servidor' });
  }
}

/**
 * POST /api/productos
 * Crea un nuevo producto
 */
export async function createProducto(req: Request, res: Response): Promise<void> {
  try {
    const { sku, nombre, categoria, precio, stock, stock_minimo, descripcion } = req.body;

    if (!sku || !nombre || !categoria || precio === undefined) {
      res.status(400).json({ error: 'Campos requeridos faltantes' });
      return;
    }

    if (isNaN(parseFloat(precio)) || parseFloat(precio) < 0) {
      res.status(400).json({ error: 'Precio debe ser un número positivo' });
      return;
    }

    // Verificar SKU único
    const checkSku = await pool.query(
      'SELECT id FROM productos WHERE sku = $1 AND activo = true',
      [sku]
    );
    if (checkSku.rows.length > 0) {
      res.status(409).json({ error: 'SKU ya existe' });
      return;
    }

    const query = `
      INSERT INTO productos (sku, nombre, categoria, precio, stock, stock_minimo, descripcion, activo, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW(), NOW())
      RETURNING *
    `;

    const result = await pool.query(query, [
      sku,
      nombre,
      categoria,
      parseFloat(precio),
      stock || 0,
      stock_minimo || 10,
      descripcion || null,
    ]);

    logger.info(`✓ Producto creado: ${sku} - ${nombre}`);

    res.status(201).json({
      message: 'Producto creado exitosamente',
      producto: result.rows[0]
    });
  } catch (err) {
    logger.error('Error creando producto:', err);
    res.status(500).json({ error: 'Error en servidor' });
  }
}

/**
 * PUT /api/productos/:id
 * Actualiza un producto
 */
export async function updateProducto(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { sku, nombre, categoria, precio, stock, stock_minimo, descripcion } = req.body;

    const checkProducto = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
    if (checkProducto.rows.length === 0) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }

    if (sku && sku !== checkProducto.rows[0].sku) {
      const checkSku = await pool.query(
        'SELECT id FROM productos WHERE sku = $1 AND id != $2 AND activo = true',
        [sku, id]
      );
      if (checkSku.rows.length > 0) {
        res.status(409).json({ error: 'SKU ya existe' });
        return;
      }
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (sku !== undefined) {
      updates.push(`sku = $${paramCount++}`);
      values.push(sku);
    }
    if (nombre !== undefined) {
      updates.push(`nombre = $${paramCount++}`);
      values.push(nombre);
    }
    if (categoria !== undefined) {
      updates.push(`categoria = $${paramCount++}`);
      values.push(categoria);
    }
    if (precio !== undefined) {
      updates.push(`precio = $${paramCount++}`);
      values.push(parseFloat(precio));
    }
    if (stock !== undefined) {
      updates.push(`stock = $${paramCount++}`);
      values.push(stock);
    }
    if (stock_minimo !== undefined) {
      updates.push(`stock_minimo = $${paramCount++}`);
      values.push(stock_minimo);
    }
    if (descripcion !== undefined) {
      updates.push(`descripcion = $${paramCount++}`);
      values.push(descripcion);
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    if (updates.length <= 1) {
      res.status(400).json({ error: 'No hay campos para actualizar' });
      return;
    }

    const query = `
      UPDATE productos
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    logger.info(`✓ Producto actualizado: ${id}`);

    res.status(200).json({
      message: 'Producto actualizado exitosamente',
      producto: result.rows[0]
    });
  } catch (err) {
    logger.error('Error actualizando producto:', err);
    res.status(500).json({ error: 'Error en servidor' });
  }
}

/**
 * DELETE /api/productos/:id
 * Elimina un producto (soft delete)
 */
export async function deleteProducto(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const checkProducto = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
    if (checkProducto.rows.length === 0) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }

    const query = `
      UPDATE productos
      SET activo = false, updated_at = NOW()
      WHERE id = $1
      RETURNING id, sku, nombre
    `;

    const result = await pool.query(query, [id]);

    logger.info(`✓ Producto eliminado: ${id}`);

    res.status(200).json({
      message: 'Producto eliminado exitosamente',
      producto: result.rows[0]
    });
  } catch (err) {
    logger.error('Error eliminando producto:', err);
    res.status(500).json({ error: 'Error en servidor' });
  }
}
