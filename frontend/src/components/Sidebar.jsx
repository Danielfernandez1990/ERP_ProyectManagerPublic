/**
 * Sidebar Component
 * Menú lateral de navegación
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome, FiUsers, FiBox, FiBriefcase, FiCheckSquare,
  FiChevronDown, FiSettings
} from 'react-icons/fi';

const menuItems = [
  { name: 'Dashboard', icon: FiHome, path: '/dashboard' },
  { name: 'Clientes', icon: FiUsers, path: '/clientes' },
  { name: 'Productos', icon: FiBox, path: '/productos' },
  { name: 'Proyectos', icon: FiBriefcase, path: '/proyectos' },
  { name: 'Tareas', icon: FiCheckSquare, path: '/tareas' },
];

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const [expandAdmin, setExpandAdmin] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-gray-900 text-white overflow-y-auto transition-transform duration-300 z-40 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="p-4 space-y-2">
          {/* Main menu items */}
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}

          {/* Divider */}
          <div className="my-4 border-t border-gray-700"></div>

          {/* Admin section */}
          <button
            onClick={() => setExpandAdmin(!expandAdmin)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition"
          >
            <FiSettings size={20} />
            <span className="font-medium flex-1 text-left">Admin</span>
            <FiChevronDown
              size={16}
              className={`transition ${expandAdmin ? 'rotate-180' : ''}`}
            />
          </button>

          {expandAdmin && (
            <div className="ml-2 space-y-2">
              <Link
                to="/admin/usuarios"
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition ${
                  isActive('/admin/usuarios')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800'
                }`}
              >
                Gestionar Usuarios
              </Link>
              <Link
                to="/admin/licencias"
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition ${
                  isActive('/admin/licencias')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800'
                }`}
              >
                Licencias
              </Link>
              <Link
                to="/admin/integraciones"
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition ${
                  isActive('/admin/integraciones')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800'
                }`}
              >
                Integraciones
              </Link>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
};
