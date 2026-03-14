/**
 * Servicio API centralizado
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = {
  auth: {
    login: (credentials) => fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    }).then(r => r.json()),
    
    logout: () => fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    }).then(r => r.json()),
  },
  
  licencias: {
    getAll: () => fetch(`${API_BASE_URL}/licencias`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    }).then(r => r.json()),
    
    get: (id) => fetch(`${API_BASE_URL}/licencias/${id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    }).then(r => r.json()),
    
    create: (data) => fetch(`${API_BASE_URL}/licencias`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    }).then(r => r.json()),
    
    validate: (key) => fetch(`${API_BASE_URL}/licencias/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ clave: key }),
    }).then(r => r.json()),
  },
  
  integraciones: {
    getAll: () => fetch(`${API_BASE_URL}/integraciones`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    }).then(r => r.json()),
    
    create: (data) => fetch(`${API_BASE_URL}/integraciones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    }).then(r => r.json()),
    
    test: (id) => fetch(`${API_BASE_URL}/integraciones/${id}/test`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    }).then(r => r.json()),
    
    sync: (id) => fetch(`${API_BASE_URL}/integraciones/${id}/sync`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    }).then(r => r.json()),
  },
  
  admin: {
    getConfig: () => fetch(`${API_BASE_URL}/admin/config`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    }).then(r => r.json()),
    
    updateConfig: (data) => fetch(`${API_BASE_URL}/admin/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    }).then(r => r.json()),
  },
};
