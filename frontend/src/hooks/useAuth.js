/**
 * Hook useAuth
 * Proporciona acceso a autenticación
 */

import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { usuario, token, isLoading, error, setUsuario, setToken, login, logout, setLoading } = useAuthStore();

  return {
    usuario,
    token,
    isLoading,
    error,
    isAuthenticated: !!token,
    login,
    logout,
    setUsuario,
    setToken,
    setLoading,
  };
};
