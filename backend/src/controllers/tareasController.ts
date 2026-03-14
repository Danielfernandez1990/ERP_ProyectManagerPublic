/**
 * Controlador de Tareas (Kanban)
 * CRUD completo de tareas con estados
 */

import { Request, Response } from 'express';
import { pool } from '../config/database.js';
import { logger } from '../utils/logger.js';

/**
 * GET /api/tareas
 * Lista todas las tareas (con paginación y filtros por proyecto/estado)
 */
export async function getTareas(req: Request, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const proyecto_id = req.query.proyecto_id as string;
    const estado = req.query.estado as string;

    let countQuery = 'SELECT COUNT(*) as total FROM tareas WHERE 1=1';
    let query = `
      SELECT t.*, p.nombre as proyecto_nombre, u.nombre as asignado_nombre
      FROM tareas t
      LEFT JOIN proyectos p ON t.proyecto_id = p.id
      LEFT JOIN usuarios u ON t.asignado_a = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (proyecto_id) {
      countQuery += ' AND proyecto_id = $' + (params.length + 1);
      query += ' AND t.proyecto_id = $' + (params.length + 1);
      params.push(proyecto_id);
    }

    if (estado) {
      countQuery += ' AND estado = $' + (params.length + 1);
      query += ' AND t.estado = $' + (params.length + 1);
      params.push(estado);
    }

    query += ' ORDER BY t.prioridad DESC, t.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);

    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    const result = await pool.query(query, [...params, limit, offset]);

    logger.info(`✓ Listado de tareas: ${result.rows.length} registros`);

    res.status(200).json({
      tareas: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (err) {
    logger.error('Error listando tareas:', err);
    res.status(500).json({ error: 'Error en servidor' });
  }
}

/**
 * GET /api/tareas/:id
 * Obtiene una tarea específica
 */
export async function getTarea(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const query = `
      SELECT t.*, p.nombre as proyecto_nombre, u.nombre as asignado_nombre
      FROM tareas t
      LEFT JOIN proyectos p ON t.proyecto_id = p.id
      LEFT JOIN usuarios u ON t.asignado_a = u.id
      WHERE t.id = $1
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Tarea no encontrada' });
      return;
    }

    res.status(200).json({ tarea: result.rows[0] });
  } catch (err) {
    logger.error('Error obteniendo tarea:', err);
    res.status(500).json({ error: 'Error en servidor' });
  }
}

/**
 * POST /api/tareas
 * Crea una nueva tarea
 */
export async function createTarea(req: Request, res: Response): Promise<void> {
  try {
    const { codigo, titulo, descripcion, proyecto_id, prioridad, asignado_a, fecha_vencimiento } = req.body;

    if (!codigo || !titulo || !proyecto_id) {
      res.status(400).json({ error: 'Código, título y proyecto son requeridos' });
      return;
    }

    // Verificar código único
    const checkCodigo = await pool.query(
      'SELECT id FROM tareas WHERE codigo = $1',
      [codigo]
    );
    if (checkCodigo.rows.length > 0) {
      res.status(409).json({ error: 'Código de tarea ya existe' });
      return;
    }

    // Verificar proyecto existe
    const checkProyecto = await pool.query(
      'SELECT id FROM proyectos WHERE id = $1',
      [proyecto_id]
    );
    if (checkProyecto.rows.length === 0) {
      res.status(400).json({ error: 'Proyecto no encontrado' });
      return;
    }

    // Verificar usuario asignado si se proporciona
    if (asignado_a) {
      const checkUsuario = await pool.query(
        'SELECT id FROM usuarios WHERE id = $1 AND activo = true',
        [asignado_a]
      );
      if (checkUsuario.rows.length === 0) {
        res.status(400).json({ error: 'Usuario no encontrado' });
        return;
      }
    }

    const query = `
      INSERT INTO tareas (codigo, titulo, descripcion, proyecto_id, estado, prioridad, asignado_a, fecha_vencimiento, created_at, updated_at)
      VALUES ($1, $2, $3, $4, 'PENDIENTE', $5, $6, $7, NOW(), NOW())
      RETURNING *
    `;

    const result = await pool.query(query, [
      codigo,
      titulo,
      descripcion || null,
      proyecto_id,
      prioridad || 'MEDIA',
      asignado_a || null,
      fecha_vencimiento || null,
    ]);

    logger.info(`✓ Tarea creada: ${codigo} - ${titulo}`);

    res.status(201).json({
      message: 'Tarea creada exitosamente',
      tarea: result.rows[0]
    });
  } catch (err) {
    logger.error('Error creando tarea:', err);
    res.status(500).json({ error: 'Error en servidor' });
  }
}

/**
 * PUT /api/tareas/:id
 * Actualiza una tarea
 */
export async function updateTarea(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { titulo, descripcion, estado, prioridad, asignado_a, fecha_vencimiento } = req.body;

    const checkTarea = await pool.query('SELECT * FROM tareas WHERE id = $1', [id]);
    if (checkTarea.rows.length === 0) {
      res.status(404).json({ error: 'Tarea no encontrada' });
      return;
    }

    // Verificar usuario asignado si se proporciona
    if (asignado_a) {
      const checkUsuario = await pool.query(
        'SELECT id FROM usuarios WHERE id = $1 AND activo = true',
        [asignado_a]
      );
      if (checkUsuario.rows.length === 0) {
        res.status(400).json({ error: 'Usuario no encontrado' });
        return;
      }
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (titulo !== undefined) {
      updates.push(`titulo = $${paramCount++}`);
      values.push(titulo);
    }
    if (descripcion !== undefined) {
      updates.push(`descripcion = $${paramCount++}`);
      values.push(descripcion);
    }
    if (estado !== undefined) {
      updates.push(`estado = $${paramCount++}`);
      values.push(estado);
    }
    if (prioridad !== undefined) {
      updates.push(`prioridad = $${paramCount++}`);
      values.push(prioridad);
    }
    if (asignado_a !== undefined) {
      updates.push(`asignado_a = $${paramCount++}`);
      values.push(asignado_a);
    }
    if (fecha_vencimiento !== undefined) {
      updates.push(`fecha_vencimiento = $${paramCount++}`);
      values.push(fecha_vencimiento);
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    if (updates.length <= 1) {
      res.status(400).json({ error: 'No hay campos para actualizar' });
      return;
    }

    const query = `
      UPDATE tareas
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    logger.info(`✓ Tarea actualizada: ${id}`);

    res.status(200).json({
      message: 'Tarea actualizada exitosamente',
      tarea: result.rows[0]
    });
  } catch (err) {
    logger.error('Error actualizando tarea:', err);
    res.status(500).json({ error: 'Error en servidor' });
  }
}

/**
 * DELETE /api/tareas/:id
 * Elimina una tarea
 */
export async function deleteTarea(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const checkTarea = await pool.query('SELECT * FROM tareas WHERE id = $1', [id]);
    if (checkTarea.rows.length === 0) {
      res.status(404).json({ error: 'Tarea no encontrada' });
      return;
    }

    // Hard delete para tareas (no hay datos sensibles)
    const query = `
      DELETE FROM tareas
      WHERE id = $1
      RETURNING id, codigo, titulo
    `;

    const result = await pool.query(query, [id]);

    logger.info(`✓ Tarea eliminada: ${id}`);

    res.status(200).json({
      message: 'Tarea eliminada exitosamente',
      tarea: result.rows[0]
    });
  } catch (err) {
    logger.error('Error eliminando tarea:', err);
    res.status(500).json({ error: 'Error en servidor' });
  }
}

/**
 * GET /api/tareas/proyecto/:proyecto_id
 * Obtiene todas las tareas de un proyecto organizadas por estado (Kanban)
 */
export async function getTareasPorProyecto(req: Request, res: Response): Promise<void> {
  try {
    const { proyecto_id } = req.params;

    const query = `
      SELECT t.*, u.nombre as asignado_nombre
      FROM tareas t
      LEFT JOIN usuarios u ON t.asignado_a = u.id
      WHERE t.proyecto_id = $1
      ORDER BY t.prioridad DESC, t.created_at DESC
    `;

    const result = await pool.query(query, [proyecto_id]);

    // Organizar por estado (Kanban)
    const kanban = {
      PENDIENTE: result.rows.filter(t => t.estado === 'PENDIENTE'),
      PROGRESO: result.rows.filter(t => t.estado === 'PROGRESO'),
      COMPLETADO: result.rows.filter(t => t.estado === 'COMPLETADO'),
    };

    logger.info(`✓ Kanban obtenido para proyecto: ${proyecto_id}`);

    res.status(200).json({ kanban });
  } catch (err) {
    logger.error('Error obteniendo kanban:', err);
    res.status(500).json({ error: 'Error en servidor' });
  }
}
