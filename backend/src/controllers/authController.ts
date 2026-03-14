/**
 * Controlador de Autenticación
 * Maneja login, logout, refresh de tokens
 */

import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { pool } from '../config/database.js';
import { generateToken, verifyToken } from '../utils/jwt.js';
import { logger } from '../utils/logger.js';
import { validateEmail, validatePassword } from '../utils/validators.js';

/**
 * POST /api/auth/login
 * Autentica usuario y devuelve JWT
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    // Validar que los campos existan
    if (!email || !password) {
      res.status(400).json({ 
        error: 'Validación fallida',
        message: 'Email y contraseña son requeridos'
      });
      return;
    }

    // Validar formato email
    if (!validateEmail(email)) {
      res.status(400).json({ 
        error: 'Email inválido',
        message: 'Ingresa un email válido'
      });
      return;
    }

    // Buscar usuario en BD
    const query = 'SELECT * FROM usuarios WHERE email = $1 AND activo = true';
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      logger.warn(`Intento de login fallido - Usuario no encontrado: ${email}`);
      res.status(401).json({ 
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      });
      return;
    }

    const usuario = result.rows[0];

    // Verificar contraseña
    const passwordValid = await bcryptjs.compare(password, usuario.password_hash);

    if (!passwordValid) {
      logger.warn(`Intento de login fallido - Contraseña incorrecta: ${email}`);
      res.status(401).json({ 
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      });
      return;
    }

    // Generar token JWT
    const token = generateToken({
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
      departamento: usuario.departamento,
    });

    // Actualizar último login
    await pool.query(
      'UPDATE usuarios SET ultimo_login = NOW() WHERE id = $1',
      [usuario.id]
    );

    logger.info(`✓ Login exitoso: ${email} (${usuario.rol})`);

    res.status(200).json({
      message: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol,
        departamento: usuario.departamento,
      }
    });
  } catch (err) {
    logger.error('Error en login:', err);
    res.status(500).json({ 
      error: 'Error en servidor',
      message: 'No se pudo procesar el login'
    });
  }
}

/**
 * POST /api/auth/logout
 * Invalida token (en cliente se elimina localmente)
 */
export async function logout(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    logger.info(`✓ Logout: ${req.user.email}`);

    res.status(200).json({
      message: 'Logout exitoso'
    });
  } catch (err) {
    logger.error('Error en logout:', err);
    res.status(500).json({ 
      error: 'Error en servidor'
    });
  }
}

/**
 * POST /api/auth/refresh
 * Refresca un token JWT expirado
 */
export async function refresh(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    // Obtener usuario actualizado de BD
    const query = 'SELECT * FROM usuarios WHERE id = $1 AND activo = true';
    const result = await pool.query(query, [req.user.id]);

    if (result.rows.length === 0) {
      res.status(401).json({ 
        error: 'Usuario no encontrado o inactivo'
      });
      return;
    }

    const usuario = result.rows[0];

    // Generar nuevo token
    const token = generateToken({
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
      departamento: usuario.departamento,
    });

    logger.info(`✓ Token refrescado: ${usuario.email}`);

    res.status(200).json({
      message: 'Token refrescado',
      token
    });
  } catch (err) {
    logger.error('Error refrescando token:', err);
    res.status(500).json({ 
      error: 'Error en servidor'
    });
  }
}

/**
 * POST /api/auth/register
 * Registra un nuevo usuario (solo Super Admin)
 */
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { nombre, email, password, rol, departamento } = req.body;

    // Validaciones
    if (!nombre || !email || !password || !rol) {
      res.status(400).json({ 
        error: 'Validación fallida',
        message: 'Nombre, email, contraseña y rol son requeridos'
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
        message: 'Mínimo 8 caracteres, debe incluir mayúscula, minúscula y número'
      });
      return;
    }

    // Validar rol
    const rolesValidos = ['SUPER_ADMIN', 'ADMIN', 'OPERARIO', 'VISUALIZADOR'];
    if (!rolesValidos.includes(rol)) {
      res.status(400).json({ 
        error: 'Rol inválido',
        message: `Roles válidos: ${rolesValidos.join(', ')}`
      });
      return;
    }

    // Verificar si email ya existe
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

    // Insertar nuevo usuario
    const query = `
      INSERT INTO usuarios (nombre, email, password_hash, rol, departamento, activo, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW())
      RETURNING id, nombre, email, rol, departamento
    `;

    const result = await pool.query(query, [nombre, email, passwordHash, rol, departamento || null]);
    const nuevoUsuario = result.rows[0];

    logger.info(`✓ Usuario registrado: ${email} (${rol})`);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      usuario: nuevoUsuario
    });
  } catch (err) {
    logger.error('Error registrando usuario:', err);
    res.status(500).json({ 
      error: 'Error en servidor'
    });
  }
}

/**
 * GET /api/auth/me
 * Obtiene información del usuario autenticado
 */
export async function getMe(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const query = 'SELECT id, nombre, email, rol, departamento, ultimo_login FROM usuarios WHERE id = $1';
    const result = await pool.query(query, [req.user.id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Usuario no encontrado' });
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
