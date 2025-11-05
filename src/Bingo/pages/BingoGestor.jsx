import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faSignOutAlt, 
  faUser, 
  faGamepad,
  faTrophy,
  faPlay,
  faPause,
  faClock,
  faUsers,
  faListOl,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { useGestorAuth } from '../hooks/useGestorAuth';
import { useGameManager } from '../hooks/useGameManager';
import { SocketProvider } from '../context/SocketContext';
import NumberDisplay from '../components/NumberDisplay';
import BingoControls from '../components/BingoControls';

const BingoGestor = () => {
  const { gestor, logoutGestor, getTimeUntilExpiry } = useGestorAuth();
  const { getGameById, updateGame, addCalledNumber } = useGameManager();
  const [currentGame, setCurrentGame] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [gameStats, setGameStats] = useState({
    totalCards: 0,
    activeCards: 0,
    winners: 0
  });

  useEffect(() => {
    if (gestor?.gameId) {
      const game = getGameById(gestor.gameId);
      setCurrentGame(game);
      
      // Simular obtención de participantes (esto se integraría con el sistema real)
      loadParticipants();
      updateGameStats(game);
    }
  }, [gestor, getGameById]);

  const loadParticipants = () => {
    // Obtener participantes del localStorage o sistema de gestión
    const assignments = JSON.parse(localStorage.getItem('bingoAssignments') || '[]');
    const gameParticipants = assignments.filter(a => a.raffleId === 1); // Por ahora usar sorteo 1
    setParticipants(gameParticipants);
  };

  const updateGameStats = (game) => {
    if (!game) return;
    
    const assignments = JSON.parse(localStorage.getItem('bingoAssignments') || '[]');
    const gameParticipants = assignments.filter(a => a.raffleId === 1);
    
    setGameStats({
      totalCards: gameParticipants.length,
      activeCards: gameParticipants.filter(p => !p.winner).length,
      winners: gameParticipants.filter(p => p.winner).length
    });
  };

  const handleCallNumber = (number) => {
    if (currentGame) {
      addCalledNumber(currentGame.id, number);
      // Actualizar el juego local
      const updatedGame = getGameById(currentGame.id);
      setCurrentGame(updatedGame);
    }
  };

  const handleMarkWinner = (participantId) => {
    const assignments = JSON.parse(localStorage.getItem('bingoAssignments') || '[]');
    const updatedAssignments = assignments.map(a => 
      a.id === participantId ? { ...a, winner: true } : a
    );
    localStorage.setItem('bingoAssignments', JSON.stringify(updatedAssignments));
    
    loadParticipants();
    updateGameStats(currentGame);
  };

  const handlePauseGame = () => {
    if (currentGame) {
      updateGame(currentGame.id, { status: 'waiting' });
      setCurrentGame({ ...currentGame, status: 'waiting' });
    }
  };

  const handleResumeGame = () => {
    if (currentGame) {
      updateGame(currentGame.id, { status: 'active' });
      setCurrentGame({ ...currentGame, status: 'active' });
    }
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      logoutGestor();
    }
  };

  const timeLeft = getTimeUntilExpiry();

  if (!currentGame) {
    return (
      <SocketProvider>
        <div className="min-h-screen bg-linear-to-br from-orange-600 to-red-600 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md">
            <FontAwesomeIcon icon={faGamepad} className="text-6xl text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Juego No Disponible</h2>
            <p className="text-gray-600 mb-6">
              El juego asignado no está disponible o ha sido eliminado.
            </p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg transition-colors"
            >
              Volver al Login
            </button>
          </div>
        </div>
      </SocketProvider>
    );
  }

  return (
    <SocketProvider>
      <div className="min-h-screen bg-linear-to-br from-orange-600 to-red-600 p-4">
        {/* Number Display sticky */}
        <div className="fixed top-4 left-4 z-50">
          <NumberDisplay 
            currentNumber={currentGame?.currentNumber}
            calledNumbers={currentGame?.calledNumbers || []}
          />
        </div>

        <div className="max-w-7xl mx-auto ml-72">
          {/* Header */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Gestor de Sorteos - {currentGame.name}
                </h1>
                <div className="flex items-center space-x-4 text-orange-100">
                  <span className="flex items-center">
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    {gestor.name}
                  </span>
                  <span className="flex items-center">
                    <FontAwesomeIcon icon={faGamepad} className="mr-2" />
                    Juego ID: {gestor.gameId}
                  </span>
                  <span className={`flex items-center px-3 py-1 rounded-full text-sm ${
                    currentGame.status === 'active' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-yellow-500 text-white'
                  }`}>
                    {currentGame.status === 'active' ? 'Activo' : 'En Pausa'}
                  </span>
                  {timeLeft.valid && (
                    <span className="flex items-center text-sm">
                      <FontAwesomeIcon icon={faClock} className="mr-1" />
                      {timeLeft.hours}h {timeLeft.minutes}m
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <Link 
                  to="/bingo" 
                  className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition duration-300 inline-flex items-center"
                >
                  <FontAwesomeIcon icon={faHome} className="mr-2" />
                  Inicio
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-300 inline-flex items-center"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  Salir
                </button>
              </div>
            </div>
          </div>

          {/* Estadísticas del Juego */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Cartones Total</p>
                  <p className="text-2xl font-bold text-white">{gameStats.totalCards}</p>
                </div>
                <FontAwesomeIcon icon={faListOl} className="text-3xl text-orange-300" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Cartones Activos</p>
                  <p className="text-2xl font-bold text-white">{gameStats.activeCards}</p>
                </div>
                <FontAwesomeIcon icon={faUsers} className="text-3xl text-green-300" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Ganadores</p>
                  <p className="text-2xl font-bold text-white">{gameStats.winners}</p>
                </div>
                <FontAwesomeIcon icon={faTrophy} className="text-3xl text-yellow-300" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Números Cantados</p>
                  <p className="text-2xl font-bold text-white">{currentGame.calledNumbers?.length || 0}/75</p>
                </div>
                <FontAwesomeIcon icon={faListOl} className="text-3xl text-blue-300" />
              </div>
            </div>
          </div>

          {/* Controles del Juego */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Controles de Números */}
            <div className="bg-white rounded-xl shadow-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Control del Sorteo</h2>
                <div className="flex gap-2">
                  {currentGame.status === 'active' ? (
                    <button
                      onClick={handlePauseGame}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <FontAwesomeIcon icon={faPause} className="mr-2" />
                      Pausar
                    </button>
                  ) : (
                    <button
                      onClick={handleResumeGame}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <FontAwesomeIcon icon={faPlay} className="mr-2" />
                      Reanudar
                    </button>
                  )}
                </div>
              </div>
              {currentGame.status === 'active' && (
                <BingoControls 
                  onCallNumber={handleCallNumber}
                  calledNumbers={currentGame.calledNumbers || []}
                />
              )}
              {currentGame.status === 'waiting' && (
                <div className="text-center py-8">
                  <FontAwesomeIcon icon={faPause} className="text-6xl text-gray-300 mb-4" />
                  <p className="text-gray-500">El sorteo está pausado</p>
                  <p className="text-sm text-gray-400">Haz clic en "Reanudar" para continuar</p>
                </div>
              )}
            </div>

            {/* Lista de Participantes */}
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Participantes ({participants.length})
                </h2>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {participants.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {participants.map((participant) => (
                      <div key={participant.id} className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">
                              {participant.firstName} {participant.lastName}
                            </p>
                            <p className="text-sm text-gray-500">
                              Cartón #{participant.cardNumber}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {participant.winner ? (
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                                <FontAwesomeIcon icon={faTrophy} className="mr-1" />
                                Ganador
                              </span>
                            ) : (
                              <button
                                onClick={() => handleMarkWinner(participant.id)}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full text-xs transition-colors"
                              >
                                <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                                Marcar Ganador
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FontAwesomeIcon icon={faUsers} className="text-6xl text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      No hay participantes
                    </h3>
                    <p className="text-gray-500">
                      Los participantes aparecerán aquí cuando se unan al juego
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Instrucciones */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Instrucciones para el Gestor</h3>
            <div className="grid md:grid-cols-3 gap-6 text-orange-100">
              <div>
                <h4 className="font-semibold mb-2">Control de Números</h4>
                <ul className="text-sm space-y-1">
                  <li>• Usa los controles para cantar números</li>
                  <li>• Los números se muestran automáticamente</li>
                  <li>• Puedes pausar y reanudar el sorteo</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Gestión de Participantes</h4>
                <ul className="text-sm space-y-1">
                  <li>• Ve la lista de todos los participantes</li>
                  <li>• Marca ganadores cuando hagan BINGO</li>
                  <li>• Revisa el estado de cada cartón</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Estadísticas</h4>
                <ul className="text-sm space-y-1">
                  <li>• Monitorea el progreso del sorteo</li>
                  <li>• Ve estadísticas en tiempo real</li>
                  <li>• Controla el flujo del juego</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SocketProvider>
  );
};

export default BingoGestor;