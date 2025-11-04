import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserShield, 
  faGamepad, 
  faHome, 
  faTrophy,
  faUsers,
  faDice,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';

const BingoLanding = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-600 to-blue-600">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <Link 
              to="/" 
              className="text-white hover:text-purple-200 transition-colors inline-flex items-center"
            >
              <FontAwesomeIcon icon={faHome} className="mr-2" />
              ← Volver al Portfolio
            </Link>
          </div>

          {/* Hero Section */}
          <div className="text-center py-16">
            <div className="mb-8">
              <div className="text-8xl mb-4">🎱</div>
              <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
                BINGO
              </h1>
              <p className="text-2xl text-purple-100 font-medium max-w-2xl mx-auto">
                Plataforma completa de Bingo en línea con gestión profesional y experiencia de juego inmersiva
              </p>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <FontAwesomeIcon icon={faDice} className="text-4xl text-yellow-400 mb-3" />
                <div className="text-3xl font-bold text-white">1,200</div>
                <div className="text-purple-200">Cartones Únicos</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <FontAwesomeIcon icon={faUsers} className="text-4xl text-green-400 mb-3" />
                <div className="text-3xl font-bold text-white">∞</div>
                <div className="text-purple-200">Jugadores Simultáneos</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <FontAwesomeIcon icon={faTrophy} className="text-4xl text-orange-400 mb-3" />
                <div className="text-3xl font-bold text-white">Real Time</div>
                <div className="text-purple-200">Detección de Ganadores</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Options */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Elige tu Rol
          </h2>
          <p className="text-xl text-purple-100">
            Accede como administrador para gestionar juegos o como jugador para participar
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Admin Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300">
            <div className="bg-linear-to-r from-purple-700 to-purple-900 text-white p-8 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faUserShield} className="text-4xl" />
              </div>
              <h3 className="text-3xl font-bold mb-2">Administrador</h3>
              <p className="text-purple-200">Control total del sistema</p>
            </div>
            
            <div className="p-8">
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  Crear y gestionar juegos/sorteos
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  Controlar números cantados en tiempo real
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  Asignar cartones a participantes
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  Gestionar pagos y ganadores
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  Estadísticas detalladas
                </div>
              </div>

              <Link
                to="/bingo/admin"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-colors inline-flex items-center justify-center text-lg"
              >
                <FontAwesomeIcon icon={faChartLine} className="mr-3" />
                Acceder como Administrador
              </Link>
              
              <p className="text-sm text-gray-500 text-center mt-4">
                Requiere contraseña de administrador
              </p>
            </div>
          </div>

          {/* Player Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300">
            <div className="bg-linear-to-r from-green-600 to-blue-600 text-white p-8 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faGamepad} className="text-4xl" />
              </div>
              <h3 className="text-3xl font-bold mb-2">Jugador</h3>
              <p className="text-green-100">Experiencia de juego completa</p>
            </div>
            
            <div className="p-8">
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Unirse a juegos por ID único
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Ver tu cartón en tiempo real
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Seguir números cantados
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Notificaciones de BINGO automáticas
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Interfaz optimizada para móviles
                </div>
              </div>

              <Link
                to="/bingo/player"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-colors inline-flex items-center justify-center text-lg"
              >
                <FontAwesomeIcon icon={faGamepad} className="mr-3" />
                Acceder como Jugador
              </Link>
              
              <p className="text-sm text-gray-500 text-center mt-4">
                Ingresa con tu nombre y ID del juego
              </p>
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-6">Acceso Rápido</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/bingo/cartones"
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Ver Cartones Disponibles
            </Link>
            <Link
              to="/bingo/carton/1"
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Explorar Cartón de Ejemplo
            </Link>
          </div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/5 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-white/5 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-16 h-16 bg-white/5 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-10 w-24 h-24 bg-white/5 rounded-full animate-pulse delay-500"></div>
      </div>
    </div>
  );
};

export default BingoLanding;