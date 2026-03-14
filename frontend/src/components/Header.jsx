/**
 * Header Component
 * Barra superior con navegación
 */

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiUser, FiLogOut, FiBell } from 'react-icons/fi';

export const Header = ({ toggleSidebar }) => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left - Menu toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <FiMenu size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Center - Title */}
        <div className="text-xl font-bold text-gray-800">
          ERP V3.0
        </div>

        {/* Right - Notifications and User */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition relative">
            <FiBell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <FiUser size={20} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {usuario?.nombre || 'Usuario'}
              </span>
            </button>

            {/* Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-800">{usuario?.nombre}</p>
                  <p className="text-xs text-gray-500">{usuario?.email}</p>
                  <p className="text-xs text-blue-600 font-semibold">{usuario?.rol}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
                >
                  <FiLogOut size={16} />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
