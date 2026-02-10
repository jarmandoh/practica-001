import React from 'react';
import { Link } from 'react-router-dom';
import { useReservas } from '../context/ReservasContext';
import CourtCard from '../components/CourtCard';
import { COURT_TYPES } from '../data/courtsConfig';

const ReservasCanchas = () => {
  const { courts, settings } = useReservas();
  const activeCourts = courts.filter(c => c.isActive !== false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/reservas" className="flex items-center gap-2">
              <span className="text-2xl">🏟️</span>
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                {settings?.businessName || 'Canchas El Golazo'}
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link to="/reservas" className="text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-yellow-400 transition-colors">
                Inicio
              </Link>
              <Link to="/reservas/canchas" className="text-blue-700 dark:text-yellow-400 font-medium transition-colors">
                Canchas
              </Link>
              <Link to="/reservas#reservar" className="text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-yellow-400 transition-colors">
                Reservar
              </Link>
              <Link to="/reservas#contacto" className="text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-yellow-400 transition-colors">
                Contacto
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link 
                to="/reservas/admin"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Admin
              </Link>
              <Link
                to="/reservas#reservar"
                className="px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white font-medium rounded-lg transition-colors"
              >
                Reservar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="pt-24 pb-8 md:pt-28 md:pb-10 bg-linear-to-br from-blue-800 to-blue-950">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Nuestras Canchas
          </h1>
          <p className="text-sm md:text-base text-blue-100 max-w-xl mx-auto">
            Diferentes tipos de canchas para adaptarnos a tus necesidades
          </p>
        </div>
      </div>

      {/* Court Types Info */}
      <section className="py-10 md:py-12 bg-white dark:bg-gray-900">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Tipos de Canchas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-10 md:mb-12">
            {Object.values(COURT_TYPES).map(type => (
              <div 
                key={type.id}
                className="bg-linear-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-xl p-4 md:p-5 border border-yellow-300 dark:border-yellow-800"
              >
                <div className="flex items-center gap-3 mb-2 md:mb-3">
                  <span className="text-2xl md:text-3xl">{type.icon}</span>
                  <div>
                    <h3 className="font-bold text-base md:text-lg text-gray-900 dark:text-white">{type.name}</h3>
                    <p className="text-xs md:text-sm text-blue-700 dark:text-blue-400">{type.dimensions}</p>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2 md:mb-3">{type.description}</p>
                <div className="flex items-center justify-between text-xs md:text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    👥 {type.playersPerTeam} vs {type.playersPerTeam}
                  </span>
                  <span className="font-bold text-red-600 dark:text-red-400">
                    Desde ${(type.defaultPrice * 0.8).toLocaleString('es-CO')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Available Courts */}
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Canchas Disponibles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {activeCourts.map(court => (
              <CourtCard 
                key={court.id}
                court={court}
                onSelect={() => {}}
              />
            ))}
          </div>

          {activeCourts.length === 0 && (
            <div className="text-center py-8 md:py-10 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <span className="text-4xl md:text-5xl mb-3 block">🏟️</span>
              <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
                Pronto tendremos canchas disponibles
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="text-center mt-10">
            <Link
              to="/reservas#reservar"
              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded-lg transition-all transform hover:scale-105 shadow-md hover:shadow-lg text-sm md:text-base"
            >
              <span>📅</span>
              ¡Reserva tu cancha ahora!
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-4 md:py-6">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg md:text-xl">🏟️</span>
              <span className="font-bold text-sm md:text-base">{settings?.businessName || 'Canchas El Golazo'}</span>
            </div>
            <p className="text-gray-400 text-xs md:text-sm">
              © {new Date().getFullYear()} Todos los derechos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ReservasCanchas;
