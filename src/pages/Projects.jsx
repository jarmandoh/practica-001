
import ImageComponent from '../components/ImageComponent';
import { useDarkMode } from '../hooks/useDarkMode';

import React, { useEffect } from 'react';
import ProjectsSection from '../components/ProjectsSection';

function Projects() {
  useEffect(() => {
    document.title = 'Proyectos | Mi Portafolio';
  }, []);
  const isDark = useDarkMode();

  const projects = [
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'Plataforma de comercio electrónico con carrito de compras y pasarela de pagos.',
      image: 'https://via.placeholder.com/400x300',
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    },
    {
      id: 2,
      title: 'Task Manager',
      description: 'Aplicación de gestión de tareas con características colaborativas.',
      image: 'https://via.placeholder.com/400x300',
      tags: ['React', 'Firebase', 'Tailwind CSS'],
    },
    {
      id: 3,
      title: 'Social Media Dashboard',
      description: 'Dashboard para análisis de redes sociales con gráficos en tiempo real.',
      image: 'https://via.placeholder.com/400x300',
      tags: ['Next.js', 'TypeScript', 'Chart.js'],
    },
  ];

  return (
    <div className={`min-h-screen pt-20 pb-10 transition-colors ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Mis Proyectos</h1>
          <p className={`mt-4 text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Una selección de mis trabajos más recientes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <ImageComponent
                url={project.image}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {project.title}
                </h3>
                <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        isDark
                          ? 'bg-blue-900/30 text-blue-300'
                          : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-6">
                  <button className={`w-full py-2 rounded-lg font-medium transition-colors ${
                    isDark
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}>
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;