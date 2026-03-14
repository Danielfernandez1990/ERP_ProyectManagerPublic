/**
 * Dashboard Page
 * Página principal con estadísticas
 */

import { useEffect, useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { FiUsers, FiBox, FiBriefcase, FiCheckSquare } from 'react-icons/fi';

const StatCard = ({ icon: Icon, title, value, color }) => (
  <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className={`p-4 rounded-lg ${color}`}>
        <Icon size={32} className="text-white" />
      </div>
    </div>
  </div>
);

export const DashboardPage = () => {
  const [stats, setStats] = useState({
    usuarios: 0,
    clientes: 0,
    productos: 0,
    proyectos: 0,
    tareas: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Simulación de carga de datos
        // En producción, llamarías a los endpoints de la API
        setStats({
          usuarios: 15,
          clientes: 8,
          productos: 45,
          proyectos: 12,
          tareas: 28,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Cargando...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Bienvenido a tu panel de control</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard
            icon={FiUsers}
            title="Usuarios"
            value={stats.usuarios}
            color="bg-blue-500"
          />
          <StatCard
            icon={FiUsers}
            title="Clientes"
            value={stats.clientes}
            color="bg-green-500"
          />
          <StatCard
            icon={FiBox}
            title="Productos"
            value={stats.productos}
            color="bg-purple-500"
          />
          <StatCard
            icon={FiBriefcase}
            title="Proyectos"
            value={stats.proyectos}
            color="bg-yellow-500"
          />
          <StatCard
            icon={FiCheckSquare}
            title="Tareas"
            value={stats.tareas}
            color="bg-red-500"
          />
        </div>

        {/* Recent activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent projects */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Proyectos Recientes</h2>
            <div className="space-y-3">
              {[
                { name: 'Portal Web Acme', estado: 'En Progreso' },
                { name: 'App Móvil Beta', estado: 'Pendiente' },
                { name: 'Migración de BD', estado: 'Completado' },
              ].map((project, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <p className="text-sm font-medium text-gray-900">{project.name}</p>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {project.estado}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent tasks */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Tareas Asignadas</h2>
            <div className="space-y-3">
              {[
                { name: 'Diseñar interfaz', prioridad: 'Alta' },
                { name: 'Revisar código', prioridad: 'Media' },
                { name: 'Testing QA', prioridad: 'Media' },
              ].map((task, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <p className="text-sm font-medium text-gray-900">{task.name}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      task.prioridad === 'Alta'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {task.prioridad}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
