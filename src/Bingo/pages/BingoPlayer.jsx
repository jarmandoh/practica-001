import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faSignOutAlt, 
  faUser, 
  faGamepad,
  faTrophy,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import { usePlayerAuth } from '../hooks/usePlayerAuth';
import { useGameManager } from '../hooks/useGameManager';
import { useBingoAdmin } from '../hooks/useBingoAdmin';
import { useSocket } from '../hooks/useSocket';
import NumberDisplay from '../components/NumberDisplay';
import BingoCard from '../components/BingoCard';
import { SocketProvider } from '../context/SocketContext';

// Componente interno que maneja el socket
const BingoPlayerContent = () => {
  const { player, logoutPlayer, updatePlayerCard } = usePlayerAuth();
  const { getGameById } = useGameManager();
  const { getAssignmentsByRaffle } = useBingoAdmin();
  const { socket } = useSocket();
  
  const [currentGame, setCurrentGame] = useState(null);
  const [playerCard, setPlayerCard] = useState(null);
  const [gameNotFound, setGameNotFound] = useState(false);
  const [currentNumber, setCurrentNumber] = useState(null);
  const [calledNumbers, setCalledNumbers] = useState([]);

  const assignRandomCard = useCallback(() => {
    // Buscar un cartón disponible para el sorteo actual
    const assignments = getAssignmentsByRaffle(1); // Por ahora usar sorteo 1
    const assignedCards = assignments.map(a => a.cardNumber);
    
    // Encontrar un cartón disponible
    let availableCard = null;
    for (let i = 1; i <= 1200; i++) {
      if (!assignedCards.includes(i)) {
        availableCard = i;
        break;
      }
    }
    
    if (availableCard) {
      updatePlayerCard(availableCard);
    }
  }, [getAssignmentsByRaffle, updatePlayerCard]);

  const generatePlayerCardFromNumber = useCallback((cardNumber) => {
    // Generar cartón basado en el número (simulado)
    const card = [];
    const ranges = [
      [1, 15],   // B
      [16, 30],  // I
      [31, 45],  // N
      [46, 60],  // G
      [61, 75]   // O
    ];

    // Usar el número del cartón como semilla para generar siempre el mismo cartón
    const seed = cardNumber;
    const random = (max) => Math.floor((seed * 9301 + 49297) % 233280 / 233280 * max);

    for (let row = 0; row < 5; row++) {
      const cardRow = [];
      for (let col = 0; col < 5; col++) {
        if (row === 2 && col === 2) {
          cardRow.push('FREE');
        } else {
          const [min, max] = ranges[col];
          const num = min + random(max - min + 1);
          cardRow.push(num);
        }
      }
      card.push(cardRow);
    }
    
    setPlayerCard(card);
  }, []);

  // useEffect para manejar cambios en el juego
  useEffect(() => {
    if (player?.gameId) {
      const game = getGameById(player.gameId);
      if (game) {
        setCurrentGame(game);
        setGameNotFound(false);
      } else {
        setGameNotFound(true);
      }
    }
  }, [player?.gameId, getGameById]);

  // useEffect separado para la asignación de cartón - solo ejecutar una vez cuando no hay cartón
  useEffect(() => {
    if (player?.gameId && !player?.cardNumber && !playerCard) {
      assignRandomCard();
    }
  }, [player?.gameId, player?.cardNumber, playerCard, assignRandomCard]);

  // useEffect separado para generar el cartón cuando se asigna un número
  useEffect(() => {
    if (player?.cardNumber && !playerCard) {
      generatePlayerCardFromNumber(player.cardNumber);
    }
  }, [player?.cardNumber, playerCard, generatePlayerCardFromNumber]);

  // useEffect para escuchar eventos del socket
  useEffect(() => {
    if (socket) {
      socket.on('numberDrawn', (data) => {
        console.log('Número sorteado recibido:', data);
        setCurrentNumber(data.number);
        setCalledNumbers(data.calledNumbers || []);
        
        // También actualizar el juego actual con los nuevos datos
        if (currentGame) {
          setCurrentGame({
            ...currentGame,
            currentNumber: data.number,
            calledNumbers: data.calledNumbers || []
          });
        }
      });

      return () => {
        socket.off('numberDrawn');
      };
    }
  }, [socket, currentGame]);

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres salir del juego?')) {
      logoutPlayer();
    }
  };

  if (gameNotFound) {
    return (
      <div className="min-h-screen bg-linear-to-br from-red-600 to-orange-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md">
          <FontAwesomeIcon icon={faExclamationCircle} className="text-6xl text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Juego No Encontrado</h2>
          <p className="text-gray-600 mb-6">
            El juego con ID "{player?.gameId}" no existe o ha sido eliminado.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg transition-colors"
            >
              Volver al Login
            </button>
            <Link
              to="/bingo"
              className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg transition-colors"
            >
              Ir al Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-200 via-teal-100 to-blue-200 p-4">
      {/* Number Display sticky */}
      <div className="fixed top-4 left-4 z-50">
        <NumberDisplay 
          currentNumber={currentNumber || currentGame?.currentNumber}
          calledNumbers={calledNumbers.length > 0 ? calledNumbers : (currentGame?.calledNumbers || [])}
        />
      </div>

      <div className="max-w-6xl mx-auto ml-72">
        {/* Header */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 mb-6 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-700 mb-2">
                {currentGame?.name || 'Bingo Game'}
              </h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  {player?.name}
                </span>
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faGamepad} className="mr-2" />
                  Cartón #{player?.cardNumber || 'Asignando...'}
                </span>
                <span className={`flex items-center px-3 py-1 rounded-full text-sm ${
                  currentGame?.status === 'active' 
                    ? 'bg-green-200 text-green-800' 
                    : currentGame?.status === 'waiting'
                    ? 'bg-yellow-200 text-yellow-800'
                    : 'bg-gray-200 text-gray-800'
                }`}>
                  {currentGame?.status === 'active' && '🟢 En Juego'}
                  {currentGame?.status === 'waiting' && '⏳ Esperando'}
                  {currentGame?.status === 'finished' && '🏁 Finalizado'}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Link 
                to="/bingo" 
                className="bg-blue-200 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-300 transition duration-300 inline-flex items-center"
              >
                <FontAwesomeIcon icon={faHome} className="mr-2" />
                Inicio
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-200 hover:bg-red-300 text-red-800 px-4 py-2 rounded-lg transition duration-300 inline-flex items-center"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                Salir
              </button>
            </div>
          </div>
        </div>

        {/* Game Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Player Card */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            {playerCard ? (
              <BingoCard 
                card={playerCard}
                calledNumbers={calledNumbers.length > 0 ? calledNumbers : (currentGame?.calledNumbers || [])}
              />
            ) : (
              <div className="bg-white rounded-xl p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Generando tu cartón...</p>
              </div>
            )}
          </div>

          {/* Game Info */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-700 mb-6">Información del Juego</h2>
            
            <div className="space-y-4">
              {/* Game Status */}
              <div className="bg-white/40 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-2">Estado del Juego</h3>
                <p className="text-gray-600">
                  {currentGame?.status === 'waiting' && 'Esperando que inicie el juego...'}
                  {currentGame?.status === 'active' && 'Juego en progreso'}
                  {currentGame?.status === 'finished' && 'Juego finalizado'}
                </p>
              </div>

              {/* Game Progress */}
              <div className="bg-white/40 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-2">Progreso</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Números cantados:</span>
                    <span>{(calledNumbers.length > 0 ? calledNumbers : (currentGame?.calledNumbers || [])).length}/75</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-300 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(((calledNumbers.length > 0 ? calledNumbers : (currentGame?.calledNumbers || [])).length) / 75) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Winners */}
              {currentGame?.winners && currentGame.winners.length > 0 && (
                <div className="bg-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2 flex items-center">
                    <FontAwesomeIcon icon={faTrophy} className="mr-2" />
                    Ganadores
                  </h3>
                  <div className="space-y-1">
                    {currentGame.winners.map((winner, index) => (
                      <div key={index} className="text-yellow-800">
                        🎉 {winner.name || `Cartón #${winner.cardNumber}`}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-white/40 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-2">Instrucciones</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Los números se marcan automáticamente</li>
                  <li>• Recibirás notificación si haces BINGO</li>
                  <li>• El juego actualiza en tiempo real</li>
                  <li>• Mantén esta ventana abierta durante el juego</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
  );
};

// Componente wrapper que provee el SocketProvider
const BingoPlayer = () => {
  return (
    <SocketProvider>
      <BingoPlayerContent />
    </SocketProvider>
  );
};

export default BingoPlayer;