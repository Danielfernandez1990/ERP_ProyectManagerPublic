/**
 * Controlador de Proyectos
 * CRUD completo de proyectos
 */

import { Request, Response } from 'express';
import { pool } from '../config/database.js';
import { logger } from '../utils/logger.js';

/**
 * GET /api/proyectos
 * Lista todos los proyectos (con paginación y filtros)
 */
export async function getProyectos(req: Request, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const estado = req.query.estado as string;

    let countQuery = 'SELECT COUNT(*) as total FROM proyectos WHERE 1=1';
    let query = `
      SELECT p.*, c.nombre as cliente_nombre FROM proyectos p
      LEFT JOIN clientes c ON p.cliente_id = c.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (estado) {
      countQuery += ' AND estado = $' + (params.length + 1);
      query += ' AND p.estado = $' + (params.length + 1);
      params.push(estado);
    }

    query += ' ORDER BY p.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);

    const countResult = await pool.query(countQuery, estado ? [estado] : []);
    const total = parseInt(countResult.rows[0].total);

    const result = await pool.query(query, [...params, limit, offset]);

    logger.info(`✓ Listado de proyectos: ${result.rows.length} registros`);

    res.status(200).json({
      proyectos: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (err) {
    logger.error('Error listando proyectos:', err);
    res.status(500).json({ error: 'Error en servidor' });
  }
}

/**
 * GET /api/proyectos/:id
 * Obtiene un proyecto específico
 */
export async function getProyecto(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const query = `
      SELECT p.*, c.nombre as cliente_nombre FROM proyectos p
      LEFT JOIN clientes c ON p.cliente_id = c.id
      WHERE p.id = $1
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Proyecto no encontrado' });
      return;
    }

    res.status(200).json({ proyecto: result.rows[0] });
  } catch (err) {
    logger.error('Error obteniendo proyecto:', err);
    res.status(500).json({ error: 'Error en servidor' });
  }
}

/**
 * POST /api/proyectos
 * Crea un nuevo proyecto
 */
export async function createProyecto(req: Request, res: Response): Promise<void> {
  try {
    const { codigo, nombre, cliente_id, descripcion, fecha_inicio, fecha_fin_estimada } = req.body;

    if (!codigo || !nombre) {
      res.status(400).json({ error: 'Código y nombre son requeridos' });
      return;
    }

    // Verificar código único
    const checkCodigo = await pool.query(
      'SELECT id FROM proyectos WHERE codigo = $1',
      [codigo]
    );
    if (checkCodigo.rows.length > 0) {
      res.status(409).json({ error: 'Código de proyecto ya existe' });
      return;
    }

    // Verificar cliente existe
    if (cliente_id) {
      const checkCliente = await pool.query(
        'SELECT id FROM clientes WHERE id = $1 AND activo = true',
        [cliente_id]
      );
      if (checkCliente.rows.length === 0) {
        res.status(400).json({ error: 'Cliente no encontrado' });
        return;
      }
    }

    const query = `
      INSERT INTO proyectos (codigo, nombre, cliente_id, descripcion, estado, fecha_inicio, fecha_fin_estimada, nivel_riesgo, created_at, updated_at)
      VALUES ($1, $2, $3, $4, 'PENDIENTE', $5, $6, 'BAJO', NOW(), NOW())
      RETURNING *
    `;

    const result = await pool.query(query, [
      codigo,
      nombre,
      cliente_id || null,
      descripcion || null,
      fecha_inicio || null,
      fecha_fin_estimada || null,
    ]);

    logger.info(`✓ Proyecto creado: ${codigo} - ${nombre}`);

    res.status(201).json({
      message: 'Proyecto creado exitosamente',
      proyecto: result.rows[0]
    });
  } catch (err) {
    logger.error('Error creando proyecto:', err);
    res.status(500).json({ error: 'Error en servidor' });
  }
}

/**
 * PUT /api/proyectos/:id
 * Actualiza un proyecto
 */
export async function updateProyecto(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { nombre, cliente_id, descripcion, estado, fecha_inicio, fecha_fin_estimada, fecha_fin_real, ganancia, nivel_riesgo } = req.body;

    const checkProyecto = await pool.query('SELECT * FROM proyectos WHERE id = $1', [id]);
    if (checkProyecto.rows.length === 0) {
      res.status(404).json({ error: 'Proyecto no encontrado' });
      return;
    }

    // Verificar cliente si se proporciona
    if (cliente_id) {
      const checkCliente = await pool.query(
        'SELECT id FROM clientes WHERE id = $1 AND activo = true',
        [cliente_id]
      );
      if (checkCliente.rows.length === 0) {
        res.status(400).json({ error: 'Cliente no encontrado' });
        return;
      }
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (nombre !== undefined) {
      updates.push(`nombre = $${paramCount++}`);
      values.push(nombre);
    }
    if (cliente_id !== undefined) {
      updates.push(`cliente_id = $${paramCount++}`);
      values.push(cliente_id);
    }
    if (descripcion !== undefined) {
      updates.push(`descripcion = $${paramCount++}`);
      values.push(descripcion);
    }
    if (estado !== undefined) {
      updates.push(`estado = $${paramCount++}`);
      values.push(estado);
    }
    if (fecha_inicio !== undefined) {
      updates.push(`fecha_inicio = $${paramCount++}`);
      values.push(fecha_inicio);
    }
    if (fecha_fin_estimada !== undefined) {
      updates.push(`fecha_fin_estimada = $${paramCount++}`);
      values.push(fecha_fin_estimada);
    }
    if (fecha_fin_real !== undefined) {
      updates.push(`fecha_fin_real = $${paramCount++}`);
      values.push(fecha_fin_real);
    }
    if (ganancia !== undefined) {
      updates.push(`ganancia = $${paramCount++}`);
      values.push(ganancia);
    }
    if (nivel_riesgo !== undefined) {
      updates.push(`nivel_riesgo = $${paramCount++}`);
      values.push(nivel_riesgo);
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    if (updates.length <= 1) {
      res.status(400).json({ error: 'No hay campos para actualizar' });
      return;
    }

    const query = `
      UPDATE proyectos
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    logger.info(`✓ Proyecto actualizado: ${id}`);

    res.status(200).json({
      message: 'Proyecto actualizado exitosamente',
      proyecto: result.rows[0]
    });
  } catch (err) {
    logger.error('Error actualizando proyecto:', err);
    res.status(500).json({ error: 'Error en servidor' });
  }
}

/**
 * DELETE /api/proyectos/:id
 * Elimina un proyecto (soft delete)
 */
export async function deleteProyecto(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const checkProyecto = await pool.query('SELECT * FROM proyectos WHERE id = $1', [id]);
    if (checkProyecto.rows.length === 0) {
      res.status(404).json({ error: 'Proyecto no encontrado' });
      return;
    }

    // Marcar como cancelado
    const query = `
      UPDATE proyectos
      SET estado = 'CANCELADO', updated_at = NOW()
      WHERE id = $1
      RETURNING id, codigo, nombre
    `;

    const result = await pool.query(query, [id]);

    logger.info(`✓ Proyecto cancelado: ${id}`);

    res.status(200).json({
      message: 'Proyecto cancelado exitosamente',
      proyecto: result.rows[0]
    });
  } catch (err) {
    logger.error('Error eliminando proyecto:', err);
    res.status(500).json({ error: 'Error en servidor' });
  }
}
