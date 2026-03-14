/**
 * Encriptación y desencriptación de datos sensibles
 */

import crypto from 'crypto';
import { config } from '../config/env.js';

const ALGORITHM = 'aes-256-cbc';
const KEY = crypto
  .createHash('sha256')
  .update(String(config.encryption.key))
  .digest();
const IV = crypto
  .createHash('sha256')
  .update(String(config.encryption.iv))
  .digest()
  .slice(0, 16);

export function encrypt(text: string): string {
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, IV);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export function decrypt(encrypted: string): string {
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, IV);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export function hash(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}
