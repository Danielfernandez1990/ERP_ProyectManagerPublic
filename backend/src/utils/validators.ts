/**
 * Funciones de validación usando Joi
 */

import Joi from 'joi';

export const schemas = {
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
  
  usuario: Joi.object({
    nombre: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8),
    rol: Joi.string().valid('SUPER_ADMIN', 'ADMIN', 'OPERARIO', 'VISUALIZADOR').required(),
    departamento: Joi.string(),
    activo: Joi.boolean(),
  }),
  
  licencia: Joi.object({
    tipoLicencia: Joi.string().valid('USERS', 'MODULES', 'ENTERPRISE').required(),
    cantidadUsuarios: Joi.number().min(1).required(),
    modulosIncluidos: Joi.array().items(Joi.string()),
    fechaInicio: Joi.date().required(),
    fechaVencimiento: Joi.date().min(Joi.ref('fechaInicio')).required(),
  }),
  
  integracion: Joi.object({
    nombre: Joi.string().min(3).required(),
    tipo: Joi.string().valid('WEBHOOK', 'REST', 'SOAP', 'CUSTOM').required(),
    baseUrl: Joi.string().uri().required(),
    apiKey: Joi.string().required(),
    endpoints: Joi.object().keys({
      clientes: Joi.string(),
      productos: Joi.string(),
      stock: Joi.string(),
      precios: Joi.string(),
      usuarios: Joi.string(),
    }),
    frecuenciaSync: Joi.number().min(5).required(),
  }),
  
  cliente: Joi.object({
    nombre: Joi.string().min(3).required(),
    email: Joi.string().email(),
    telefono: Joi.string(),
    direccion: Joi.string(),
    ciudad: Joi.string(),
  }),
  
  producto: Joi.object({
    nombre: Joi.string().min(3).required(),
    categoria: Joi.string().required(),
    precio: Joi.number().min(0).required(),
    stock: Joi.number().min(0).required(),
    descripcion: Joi.string(),
  }),
};

export function validate(data: any, schema: Joi.Schema): any {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    throw new Error(
      error.details.map((d) => d.message).join(', ')
    );
  }
  return value;
}
