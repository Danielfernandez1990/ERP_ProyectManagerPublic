/**
 * Funciones JWT para autenticación
 */

import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export interface TokenPayload {
  id: string;
  email: string;
  rol: string;
  departamento?: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiry,
  });
}

export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, config.jwt.secret) as TokenPayload;
  } catch (err) {
    throw new Error('Token inválido o expirado');
  }
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch {
    return null;
  }
}
