/**
 * Controlador de Usuarios
 * CRUD completo de usuarios
 */

import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { pool } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { validateEmail, validatePassword } from '../utils/validators.js';

/**
 * GET /api/usuarios
 * Lista todos los usuarios (con paginación)
 */
export async function getUsuarios(req: Request, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    // Contar total
    const countResult = await pool.query('SELECT COUNT(*) as total FROM usuarios');
    const total = parseInt(countResult.rows[0].total);

    // Obtener usuarios paginados
    const query = `
      SELECT id, nombre, email, rol, departamento, activo, ultimo_login, created_at
      FROM usuarios
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);

    logger.info(`✓ Listado de usuarios: ${result.rows.length} registros (página ${page})`);

    res.status(200).json({
      usuarios: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (err) {
    logger.error('Error listando usuarios:', err);
    res.status(500).json({ 
      error: 'Error en servidor'
    });
  }
}

/**
 * GET /api/usuarios/:id
 * Obtiene un usuario específico
 */
export async function getUsuario(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const query = `
      SELECT id, nombre, email, rol, departamento, activo, ultimo_login, created_at
      FROM usuarios
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ 
        error: 'Usuario no encontrado'
      });
      return;
    }

    res.status(200).json({
      usuario: result.rows[0]
    });
  } catch (err) {
    logger.error('Error obteniendo usuario:', err);
    res.status(500).json({ 
      error: 'Error en servidor'
    });
  }
}

/**
 * POST /api/usuarios
 * Crea un nuevo usuario
 */
export async function createUsuario(req: Request, res: Response): Promise<void> {
  try {
    const { nombre, email, password, rol, departamento } = req.body;

    // Validaciones
    if (!nombre || !email || !password || !rol) {
      res.status(400).json({ 
        error: 'Campos requeridos faltantes'
      });
      return;
    }

    if (!validateEmail(email)) {
      res.status(400).json({ 
        error: 'Email inválido'
      });
      return;
    }

    if (!validatePassword(password)) {
      res.status(400).json({ 
        error: 'Contraseña débil',
        message: 'Mínimo 8 caracteres, mayúscula, minúscula y número'
      });
      return;
    }

    // Verificar email único
    const checkEmail = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email]
    );

    if (checkEmail.rows.length > 0) {
      res.status(409).json({ 
        error: 'Email ya registrado'
      });
      return;
    }

    // Hashear contraseña
    const passwordHash = await bcryptjs.hash(password, 10);

    // Insertar
    const query = `
      INSERT INTO usuarios (nombre, email, password_hash, rol, departamento, activo, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW())
      RETURNING id, nombre, email, rol, departamento, created_at
    `;

    const result = await pool.query(query, [nombre, email, passwordHash, rol, departamento || null]);

    logger.info(`✓ Usuario creado: ${email} (${rol})`);

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      usuario: result.rows[0]
    });
  } catch (err) {
    logger.error('Error creando usuario:', err);
    res.status(500).json({ 
      error: 'Error en servidor'
    });
  }
}

/**
 * PUT /api/usuarios/:id
 * Actualiza un usuario
 */
export async function updateUsuario(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { nombre, email, rol, departamento, activo } = req.body;

    // Verificar que usuario existe
    const checkUser = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    if (checkUser.rows.length === 0) {
      res.status(404).json({ 
        error: 'Usuario no encontrado'
      });
      return;
    }

    // Validar email si se proporciona
    if (email && email !== checkUser.rows[0].email) {
      if (!validateEmail(email)) {
        res.status(400).json({ 
          error: 'Email inválido'
        });
        return;
      }

      // Verificar que no esté en uso
      const checkEmail = await pool.query(
        'SELECT id FROM usuarios WHERE email = $1 AND id != $2',
        [email, id]
      );

      if (checkEmail.rows.length > 0) {
        res.status(409).json({ 
          error: 'Email ya registrado'
        });
        return;
      }
    }

    // Construir query dinámico
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
    if (rol !== undefined) {
      updates.push(`rol = $${paramCount++}`);
      values.push(rol);
    }
    if (departamento !== undefined) {
      updates.push(`departamento = $${paramCount++}`);
      values.push(departamento);
    }
    if (activo !== undefined) {
      updates.push(`activo = $${paramCount++}`);
      values.push(activo);
    }

    updates.push(`updated_at = NOW()`);

    values.push(id);

    if (updates.length <= 1) {
      res.status(400).json({ 
        error: 'No hay campos para actualizar'
      });
      return;
    }

    const query = `
      UPDATE usuarios
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, nombre, email, rol, departamento, activo, updated_at
    `;

    const result = await pool.query(query, values);

    logger.info(`✓ Usuario actualizado: ${id}`);

    res.status(200).json({
      message: 'Usuario actualizado exitosamente',
      usuario: result.rows[0]
    });
  } catch (err) {
    logger.error('Error actualizando usuario:', err);
    res.status(500).json({ 
      error: 'Error en servidor'
    });
  }
}

/**
 * DELETE /api/usuarios/:id
 * Elimina un usuario (soft delete)
 */
export async function deleteUsuario(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    // Verificar que usuario existe
    const checkUser = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    if (checkUser.rows.length === 0) {
      res.status(404).json({ 
        error: 'Usuario no encontrado'
      });
      return;
    }

    // Soft delete (solo marcar como inactivo)
    const query = `
      UPDATE usuarios
      SET activo = false, updated_at = NOW()
      WHERE id = $1
      RETURNING id, nombre, email
    `;

    const result = await pool.query(query, [id]);

    logger.info(`✓ Usuario eliminado (desactivado): ${id}`);

    res.status(200).json({
      message: 'Usuario eliminado exitosamente',
      usuario: result.rows[0]
    });
  } catch (err) {
    logger.error('Error eliminando usuario:', err);
    res.status(500).json({ 
      error: 'Error en servidor'
    });
  }
}

/**
 * PUT /api/usuarios/:id/password
 * Cambia la contraseña de un usuario
 */
export async function changePassword(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      res.status(400).json({ 
        error: 'Nueva contraseña requerida'
      });
      return;
    }

    if (!validatePassword(newPassword)) {
      res.status(400).json({ 
        error: 'Contraseña débil',
        message: 'Mínimo 8 caracteres, mayúscula, minúscula y número'
      });
      return;
    }

    // Hashear contraseña
    const passwordHash = await bcryptjs.hash(newPassword, 10);

    // Actualizar
    const query = `
      UPDATE usuarios
      SET password_hash = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, nombre, email
    `;

    const result = await pool.query(query, [passwordHash, id]);

    if (result.rows.length === 0) {
      res.status(404).json({ 
        error: 'Usuario no encontrado'
      });
      return;
    }

    logger.info(`✓ Contraseña actualizada para usuario: ${id}`);

    res.status(200).json({
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (err) {
    logger.error('Error cambiando contraseña:', err);
    res.status(500).json({ 
      error: 'Error en servidor'
    });
  }
}
