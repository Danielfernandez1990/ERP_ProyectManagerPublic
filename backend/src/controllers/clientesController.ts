/**
 * Controlador de Clientes
 * CRUD completo de clientes
 */

import { Request, Response } from 'express';
import { pool } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { validateEmail } from '../utils/validators.js';

/**
 * GET /api/clientes
 * Lista todos los clientes (con paginación)
 */
export async function getClientes(req: Request, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const countResult = await pool.query('SELECT COUNT(*) as total FROM clientes WHERE activo = true');
    const total = parseInt(countResult.rows[0].total);

    const query = `
      SELECT * FROM clientes
      WHERE activo = true
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);

    logger.info(`✓ Listado de clientes: ${result.rows.length} registros`);

    res.status(200).json({
      clientes: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (err) {
    logger.error('Error listando clientes:', err);
    res.status(500).json({ error: 'Error en servidor' });
  }
}

/**
 * GET /api/clientes/:id
 * Obtiene un cliente específico
 */
export async function getCliente(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const query = 'SELECT * FROM clientes WHERE id = $1 AND activo = true';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Cliente no encontrado' });
      return;
    }

    res.status(200).json({ cliente: result.rows[0] });
  } catch (err) {
    logger.error('Error obteniendo cliente:', err);
    res.status(500).json({ error: 'Error en servidor' });
  }
}

/**
 * POST /api/clientes
 * Crea un nuevo cliente
 */
export async function createCliente(req: Request, res: Response): Promise<void> {
  try {
    const { nombre, email, telefono, direccion, ciudad, ruc } = req.body;

    if (!nombre) {
      res.status(400).json({ error: 'Nombre es requerido' });
      return;
    }

    if (email && !validateEmail(email)) {
      res.status(400).json({ error: 'Email inválido' });
      return;
    }

    // Verificar RUC único si se proporciona
    if (ruc) {
      const checkRuc = await pool.query(
        'SELECT id FROM clientes WHERE ruc = $1 AND activo = true',
        [ruc]
      );
      if (checkRuc.rows.length > 0) {
        res.status(409).json({ error: 'RUC ya registrado' });
        return;
      }
    }

    const query = `
      INSERT INTO clientes (nombre, email, telefono, direccion, ciudad, ruc, activo, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW())
      RETURNING *
    `;

    const result = await pool.query(query, [
      nombre,
      email || null,
      telefono || null,
      direccion || null,
      ciudad || null,
      ruc || null,
    ]);

    logger.info(`✓ Cliente creado: ${nombre}`);

    res.status(201).json({
      message: 'Cliente creado exitosamente',
      cliente: result.rows[0]
    });
  } catch (err) {
    logger.error('Error creando cliente:', err);
    res.status(500).json({ error: 'Error en servidor' });
  }
}

/**
 * PUT /api/clientes/:id
 * Actualiza un cliente
 */
export async function updateCliente(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { nombre, email, telefono, direccion, ciudad, ruc } = req.body;

    // Verificar que cliente existe
    const checkCliente = await pool.query('SELECT * FROM clientes WHERE id = $1', [id]);
    if (checkCliente.rows.length === 0) {
      res.status(404).json({ error: 'Cliente no encontrado' });
      return;
    }

    // Validar email si se proporciona
    if (email && !validateEmail(email)) {
      res.status(400).json({ error: 'Email inválido' });
      return;
    }

    // Verificar RUC único
    if (ruc && ruc !== checkCliente.rows[0].ruc) {
      const checkRuc = await pool.query(
        'SELECT id FROM clientes WHERE ruc = $1 AND id != $2 AND activo = true',
        [ruc, id]
      );
      if (checkRuc.rows.length > 0) {
        res.status(409).json({ error: 'RUC ya registrado' });
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
    if (email !== undefined) {
      updates.push(`email = $${paramCount++}`);
      values.push(email);
    }
    if (telefono !== undefined) {
      updates.push(`telefono = $${paramCount++}`);
      values.push(telefono);
    }
    if (direccion !== undefined) {
      updates.push(`direccion = $${paramCount++}`);
      values.push(direccion);
    }
    if (ciudad !== undefined) {
      updates.push(`ciudad = $${paramCount++}`);
      values.push(ciudad);
    }
    if (ruc !== undefined) {
      updates.push(`ruc = $${paramCount++}`);
      values.push(ruc);
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    if (updates.length <= 1) {
      res.status(400).json({ error: 'No hay campos para actualizar' });
      return;
    }

    const query = `
      UPDATE clientes
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    logger.info(`✓ Cliente actualizado: ${id}`);

    res.status(200).json({
      message: 'Cliente actualizado exitosamente',
      cliente: result.rows[0]
    });
  } catch (err) {
    logger.error('Error actualizando cliente:', err);
    res.status(500).json({ error: 'Error en servidor' });
  }
}

/**
 * DELETE /api/clientes/:id
 * Elimina un cliente (soft delete)
 */
export async function deleteCliente(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const checkCliente = await pool.query('SELECT * FROM clientes WHERE id = $1', [id]);
    if (checkCliente.rows.length === 0) {
      res.status(404).json({ error: 'Cliente no encontrado' });
      return;
    }

    const query = `
      UPDATE clientes
      SET activo = false, updated_at = NOW()
      WHERE id = $1
      RETURNING id, nombre, email
    `;

    const result = await pool.query(query, [id]);

    logger.info(`✓ Cliente eliminado: ${id}`);

    res.status(200).json({
      message: 'Cliente eliminado exitosamente',
      cliente: result.rows[0]
    });
  } catch (err) {
    logger.error('Error eliminando cliente:', err);
    res.status(500).json({ error: 'Error en servidor' });
  }
}
