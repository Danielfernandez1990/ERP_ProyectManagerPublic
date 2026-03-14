/**
 * Auth Store - Zustand
 * Maneja estado de autenticación
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      // Estado
      usuario: null,
      token: null,
      isLoading: false,
      error: null,

      // Actions
      setUsuario: (usuario) => set({ usuario }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // Login
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) throw new Error('Login failed');

          const data = await response.json();
          set({
            usuario: data.usuario,
            token: data.token,
            isLoading: false,
          });
          return data;
        } catch (err) {
          set({ error: err.message, isLoading: false });
          throw err;
        }
      },

      // Logout
      logout: async () => {
        set({ usuario: null, token: null });
      },

      // Check auth
      isAuthenticated: () => {
        return (state) => !!state.token;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ usuario: state.usuario, token: state.token }),
    }
  )
);
