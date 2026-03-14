/**
 * API Service - Cliente HTTP centralizado
 * Maneja todas las llamadas a la API con interceptores
 */

import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Crear instancia de axios
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request - agregar token
apiClient.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response - manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado
      useAuthStore.setState({ token: null, usuario: null });
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===== Auth =====
export const authAPI = {
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),
  logout: () => apiClient.post('/auth/logout'),
  refresh: () => apiClient.post('/auth/refresh'),
  getMe: () => apiClient.get('/auth/me'),
};

// ===== Usuarios =====
export const usuariosAPI = {
  list: (page = 1, limit = 10) =>
    apiClient.get('/usuarios', { params: { page, limit } }),
  get: (id) => apiClient.get(`/usuarios/${id}`),
  create: (data) => apiClient.post('/usuarios', data),
  update: (id, data) => apiClient.put(`/usuarios/${id}`, data),
  delete: (id) => apiClient.delete(`/usuarios/${id}`),
  changePassword: (id, newPassword) =>
    apiClient.put(`/usuarios/${id}/password`, { newPassword }),
};

// ===== Clientes =====
export const clientesAPI = {
  list: (page = 1, limit = 10) =>
    apiClient.get('/clientes', { params: { page, limit } }),
  get: (id) => apiClient.get(`/clientes/${id}`),
  create: (data) => apiClient.post('/clientes', data),
  update: (id, data) => apiClient.put(`/clientes/${id}`, data),
  delete: (id) => apiClient.delete(`/clientes/${id}`),
};

// ===== Productos =====
export const productosAPI = {
  list: (page = 1, limit = 10, categoria = null) =>
    apiClient.get('/productos', { params: { page, limit, categoria } }),
  get: (id) => apiClient.get(`/productos/${id}`),
  create: (data) => apiClient.post('/productos', data),
  update: (id, data) => apiClient.put(`/productos/${id}`, data),
  delete: (id) => apiClient.delete(`/productos/${id}`),
};

// ===== Proyectos =====
export const proyectosAPI = {
  list: (page = 1, limit = 10, estado = null) =>
    apiClient.get('/proyectos', { params: { page, limit, estado } }),
  get: (id) => apiClient.get(`/proyectos/${id}`),
  create: (data) => apiClient.post('/proyectos', data),
  update: (id, data) => apiClient.put(`/proyectos/${id}`, data),
  delete: (id) => apiClient.delete(`/proyectos/${id}`),
};

// ===== Tareas =====
export const tareasAPI = {
  list: (page = 1, limit = 20, proyecto_id = null, estado = null) =>
    apiClient.get('/tareas', { params: { page, limit, proyecto_id, estado } }),
  get: (id) => apiClient.get(`/tareas/${id}`),
  kanban: (proyecto_id) => apiClient.get(`/tareas/proyecto/${proyecto_id}`),
  create: (data) => apiClient.post('/tareas', data),
  update: (id, data) => apiClient.put(`/tareas/${id}`, data),
  delete: (id) => apiClient.delete(`/tareas/${id}`),
};

export default apiClient;
