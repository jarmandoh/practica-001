import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faGamepad, 
  faHome, 
  faPlay,
  faExclamationTriangle,
  faHashtag
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useGameManager } from '../hooks/useGameManager';

const PlayerLogin = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    gameId: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { getGameById, getGamesByStatus } = useGameManager();
  const activeGames = getGamesByStatus('active');
  const waitingGames = getGamesByStatus('waiting');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Por favor, ingresa tu nombre');
      return;
    }

    if (!formData.gameId.trim()) {
      setError('Por favor, ingresa el ID del juego');
      return;
    }

    setIsLoading(true);
    setError('');

    // Verificar que el juego existe
    const game = getGameById(formData.gameId.trim());
    if (!game) {
      setError('El ID del juego no existe');
      setIsLoading(false);
      return;
    }

    if (game.status === 'finished') {
      setError('Este juego ya ha finalizado');
      setIsLoading(false);
      return;
    }

    // Simular delay para mejor UX
    await new Promise(resolve => setTimeout(resolve, 500));

    const playerData = {
      name: formData.name.trim(),
      gameId: formData.gameId.trim()
    };

    onLogin(playerData);
    setIsLoading(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const joinGame = (gameId) => {
    setFormData(prev => ({ ...prev, gameId }));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-600 to-blue-600 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header con navegación */}
        <div className="text-center mb-8">
          <Link 
            to="/bingo" 
            className="inline-flex items-center text-white hover:text-green-200 transition-colors mb-6"
          >
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            ← Volver al Inicio
          </Link>
        </div>

        {/* Tarjeta de login */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-green-600 to-blue-600 text-white p-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faGamepad} className="text-2xl" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Unirse al Juego</h1>
            <p className="text-green-100">Ingresa tus datos para comenzar a jugar</p>
          </div>

          {/* Formulario */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre del jugador */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                  <FontAwesomeIcon icon={faUser} className="mr-2 text-green-600" />
                  Tu Nombre
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:outline-none"
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              {/* ID del juego */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                  <FontAwesomeIcon icon={faHashtag} className="mr-2 text-green-600" />
                  ID del Juego
                </label>
                <input
                  type="text"
                  value={formData.gameId}
                  onChange={(e) => handleChange('gameId', e.target.value)}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-300 focus:outline-none ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: game_1234567890"
                />
              </div>

              {/* Mensaje de error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 mr-3" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Botón de unirse */}
              <button
                type="submit"
                disabled={isLoading || !formData.name.trim() || !formData.gameId.trim()}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Uniéndote...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPlay} className="mr-2" />
                    Unirse al Juego
                  </>
                )}
              </button>
            </form>

            {/* Juegos disponibles */}
            {(activeGames.length > 0 || waitingGames.length > 0) && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Juegos Disponibles
                </h3>
                
                <div className="space-y-3">
                  {/* Juegos activos */}
                  {activeGames.map(game => (
                    <div key={game.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-green-800">{game.name}</div>
                          <div className="text-sm text-green-600">
                            🟢 En progreso • {game.calledNumbers.length}/75 números
                          </div>
                        </div>
                        <button
                          onClick={() => joinGame(game.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors"
                        >
                          Unirse
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Juegos esperando */}
                  {waitingGames.map(game => (
                    <div key={game.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-blue-800">{game.name}</div>
                          <div className="text-sm text-blue-600">
                            ⏳ Esperando inicio • {game.currentPlayers}/{game.maxPlayers} jugadores
                          </div>
                        </div>
                        <button
                          onClick={() => joinGame(game.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
                        >
                          Unirse
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Información adicional */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">
                ℹ️ Instrucciones
              </h3>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Solicita el ID del juego al administrador</li>
                <li>• Una vez unido, se te asignará un cartón automáticamente</li>
                <li>• Los números se marcarán en tiempo real</li>
                <li>• Recibirás notificación automática si haces BINGO</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerLogin;