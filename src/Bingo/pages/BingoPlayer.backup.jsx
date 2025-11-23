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
import ConfirmDialog from '../components/ConfirmDialog';
import WinnerModal from '../components/WinnerModal';
import { SocketProvider } from '../context/SocketContext';
import bingoCardsData from '../data/bingoCards.json';

// Componente interno que maneja el socket
const BingoPlayerContent = () => {
  const { player, logoutPlayer, updatePlayerCard } = usePlayerAuth();
  const { getGameById } = useGameManager();
  const { getAssignmentsByRaffle } = useBingoAdmin();
  const { socket } = useSocket();
  
  const [currentGame, setCurrentGame] = useState(null);
  const [playerCard, setPlayerCard] = useState(null);
  const [gameNotFound, setGameNotFound] = useState(false);
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [winnerData, setWinnerData] = useState(null);

  // Sorteo actual y configuración (patrón y premio) si existe
  const currentRaffle = currentGame?.currentRaffle || 1;
  const raffleSettings = currentGame?.raffleSettings?.[currentRaffle];

  // Mapeo de patrones para mostrar etiqueta legible
  const patternLabel = (pattern) => {
    if (!pattern) return '';
    const map = [
      { value: 'horizontalLine1', label: 'Línea Horizontal 1' },
      { value: 'horizontalLine2', label: 'Línea Horizontal 2' },
      { value: 'horizontalLine3', label: 'Línea Horizontal 3' },
      { value: 'horizontalLine4', label: 'Línea Horizontal 4' },
      { value: 'horizontalLine5', label: 'Línea Horizontal 5' },
      { value: 'letterI1', label: 'Columna 1 (B)' },
      { value: 'letterI2', label: 'Columna 2 (I)' },
      { value: 'letterI3', label: 'Columna 3 (N)' },
      { value: 'letterI4', label: 'Columna 4 (G)' },
      { value: 'letterI5', label: 'Columna 5 (O)' },
      { value: 'diagonal', label: 'Diagonal' },
      { value: 'fourCorners', label: '4 Esquinas' },
      { value: 'letterX', label: 'Letra X' },
      { value: 'letterT', label: 'Letra T' },
      { value: 'letterL', label: 'Letra L' },
      { value: 'cross', label: 'Cruz (Centro + Fila y Columna centrales)' },
      { value: 'fullCard', label: 'Cartón Lleno' }
    ];
    return map.find(p => p.value === pattern)?.label || pattern;
  };

  // Función para obtener celdas marcadas según el patrón
  const getPatternCells = (pattern) => {
    const cells = new Set();
    if (!pattern) return cells;
    
    // Todas las celdas: 0-24 (grid 5x5)
    // Centro es siempre libre (posición 12)
    cells.add(12);
    
    switch (pattern) {
      case 'horizontalLine1':
        for (let i = 0; i < 5; i++) cells.add(i);
        break;
      case 'horizontalLine2':
        for (let i = 5; i < 10; i++) cells.add(i);
        break;
      case 'horizontalLine3':
        for (let i = 10; i < 15; i++) cells.add(i);
        break;
      case 'horizontalLine4':
        for (let i = 15; i < 20; i++) cells.add(i);
        break;
      case 'horizontalLine5':
        for (let i = 20; i < 25; i++) cells.add(i);
        break;
      case 'letterI1':
        for (let i = 0; i < 25; i += 5) cells.add(i);
        break;
      case 'letterI2':
        for (let i = 1; i < 25; i += 5) cells.add(i);
        break;
      case 'letterI3':
        for (let i = 2; i < 25; i += 5) cells.add(i);
        break;
      case 'letterI4':
        for (let i = 3; i < 25; i += 5) cells.add(i);
        break;
      case 'letterI5':
        for (let i = 4; i < 25; i += 5) cells.add(i);
        break;
      case 'diagonal':
        cells.add(0); cells.add(6); cells.add(12); cells.add(18); cells.add(24);
        break;
      case 'fourCorners':
        cells.add(0); cells.add(4); cells.add(20); cells.add(24);
        break;
      case 'letterX':
        cells.add(0); cells.add(6); cells.add(12); cells.add(18); cells.add(24);
        cells.add(4); cells.add(8); cells.add(16); cells.add(20);
        break;
      case 'letterT':
        for (let i = 0; i < 5; i++) cells.add(i);
        cells.add(2); cells.add(7); cells.add(12); cells.add(17); cells.add(22);
        break;
      case 'letterL':
        cells.add(0); cells.add(5); cells.add(10); cells.add(15); cells.add(20);
        for (let i = 20; i < 25; i++) cells.add(i);
        break;
      case 'cross':
        cells.add(2); cells.add(7); cells.add(12); cells.add(17); cells.add(22);
        cells.add(10); cells.add(11); cells.add(13); cells.add(14);
        break;
      case 'fullCard':
        for (let i = 0; i < 25; i++) cells.add(i);
        break;
      default:
        break;
    }
    return cells;
  };

  // Componente para la mini vista previa
  const PatternPreview = ({ pattern }) => {
    const cells = getPatternCells(pattern);
    return (
      <div className="grid grid-cols-5 gap-1">
        {Array.from({ length: 25 }, (_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-sm ${
              cells.has(i)
                ? 'bg-purple-400'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  useEffect(() => {
    document.title = 'Jugador | Bingo Game';
  }, []);

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
    // Buscar el cartón en los datos pregenerados
    const cardData = bingoCardsData.find(card => card.id === cardNumber);
    
    if (cardData) {
      setPlayerCard(cardData.card);
    } else {
      // Si no se encuentra el cartón, mostrar error
      console.error(`Cartón #${cardNumber} no encontrado en bingoCards.json`);
      setPlayerCard(null);
    }
  }, []);

  // useEffect para manejar cambios en el juego
  useEffect(() => {
    if (player?.gameId) {
      const game = getGameById(player.gameId);
      if (game) {
        setCurrentGame(game);
        setGameNotFound(false);
        // Sincronizar calledNumbers y currentNumber con el juego
        setCalledNumbers(game.calledNumbers || []);
      } else {
        setGameNotFound(true);
      }
    }
  }, [player?.gameId, getGameById]);

  // useEffect para sincronizar calledNumbers cuando cambie currentGame
  useEffect(() => {
    if (currentGame) {
      setCalledNumbers(currentGame.calledNumbers || []);
    }
  }, [currentGame]);

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

  // Handlers memoizados para eventos del socket
  const handleNumberDrawn = useCallback((data) => {
    console.log('Número sorteado recibido:', data);
    try {
      const playerRaffle = currentGame?.currentRaffle || 1;
      if (data.raffleNumber === playerRaffle) {
        
        setCalledNumbers(data.calledNumbers || []);
        
        setCurrentGame(prev => ({
          ...prev,
          currentNumber: data.number,
          calledNumbers: data.calledNumbers || []
        }));
        
        // Re-cargar desde localStorage para asegurar sincronización
        if (player?.gameId) {
          const updatedGame = getGameById(player.gameId);
          if (updatedGame) {
            setCurrentGame(updatedGame);
            setCalledNumbers(updatedGame.calledNumbers || []);
            
          }
        }
      }
    } catch (error) {
      console.error('Error al procesar número sorteado:', error);
    }
  }, [currentGame, player?.gameId, getGameById]);

  const handleRaffleReset = useCallback((data) => {
    console.log('Sorteo reiniciado:', data);
    try {
      const playerRaffle = currentGame?.currentRaffle || 1;
      if (data.raffleNumber === playerRaffle) {

        setCalledNumbers([]);
        
        setCurrentGame(prev => ({
          ...prev,
          currentNumber: null,
          calledNumbers: []
        }));
        
        // Re-cargar desde localStorage
        if (player?.gameId) {
          const updatedGame = getGameById(player.gameId);
          if (updatedGame) {
            setCurrentGame(updatedGame);
            setCalledNumbers(updatedGame.calledNumbers || []);
          }
        }
      }
    } catch (error) {
      console.error('Error al procesar reinicio de sorteo:', error);
    }
  }, [currentGame, player?.gameId, getGameById]);

  const handleBingoWinPlayer = useCallback((data) => {
    console.log('Victoria detectada:', data);
    try {
      if (data.cardNumber === player?.cardNumber) {
        setWinnerData(data);
        setShowWinnerModal(true);
      }
    } catch (error) {
      console.error('Error al procesar victoria:', error);
    }
  }, [player?.cardNumber]);

  // useEffect consolidado para todos los eventos del socket
  useEffect(() => {
    if (!socket) return;

    // Handlers de conexión
    const handleConnect = () => {
      console.log('Socket conectado (Player)');
      if (player?.gameId) {
        socket.emit('joinGame', { gameId: player.gameId });
      }
    };

    const handleDisconnect = () => {
      console.log('Socket desconectado (Player)');
    };

    const handleReconnect = () => {
      console.log('Socket reconectado (Player)');
      if (player?.gameId) {
        socket.emit('joinGame', { gameId: player.gameId });
      }
    };

    // Registrar todos los listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('reconnect', handleReconnect);
    socket.on('numberDrawn', handleNumberDrawn);
    socket.on('raffleReset', handleRaffleReset);
    socket.on('bingoWin', handleBingoWinPlayer);

    // Si ya está conectado, unirse al juego
    if (socket.connected && player?.gameId) {
      socket.emit('joinGame', { gameId: player.gameId });
    }

    // Cleanup completo
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('reconnect', handleReconnect);
      socket.off('numberDrawn', handleNumberDrawn);
      socket.off('raffleReset', handleRaffleReset);
      socket.off('bingoWin', handleBingoWinPlayer);
    };
  }, [socket, player?.gameId, handleNumberDrawn, handleRaffleReset, handleBingoWinPlayer]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logoutPlayer();
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
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
    <div className="min-h-screen align-middle w-full bg-linear-to-br from-green-200 via-teal-100 to-blue-200 p-4">
      {/* Indicador de estado de conexión */}
      {socket && !socket.connected && (
        <div className="fixed top-20 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-white rounded-full"></span>
            Conexión perdida - Reconectando...
          </div>
        </div>
      )}

      {/* Confirm Logout Dialog */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="¿Salir del juego?"
        message="¿Estás seguro de que quieres salir del juego? Perderás tu progreso actual."
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />

      {/* Winner Modal */}
      {showWinnerModal && winnerData && (
        <WinnerModal
          winnerCards={[{ ...winnerData, id: winnerData.cardNumber }]}
          onClose={() => setShowWinnerModal(false)}
        />
      )}

      <div className="max-w-6xl ml-0 lg:ml-72">
        {/* Header */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 mb-6 shadow-lg">
          
            {/* Sección Izquierda: Título */}
            <div className="flex flex-col md:flex-row bg-red-600 w-full lg:w-auto p-4 rounded-lg text-white items-center justify-center gap-3">
              <div className="flex flex-col md:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h1 className="text-3xl font-bold text-gray-700">
                  {currentGame?.name || 'Bingo Game'}
                </h1>
                {/* Botones en mobile/tablet */}
                <div className="flex gap-2 lg:hidden">
                  <Link 
                    to="/bingo" 
                    className="bg-blue-200 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-300 transition duration-300 inline-flex items-center text-sm"
                  >
                    <FontAwesomeIcon icon={faHome} className="mr-2" />
                    Inicio
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-200 hover:bg-red-300 text-red-800 px-4 py-2 rounded-lg transition duration-300 inline-flex items-center text-sm"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    Salir
                  </button>
                </div>
              </div>

              {/* Información del Jugador - Mobile y Tablet */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 text-sm text-gray-600 lg:hidden">
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-700" />
                  {player?.name}
                </span>
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faGamepad} className="mr-2 text-gray-700" />
                  Cartón #{player?.cardNumber || 'Asignando...'}
                </span>
                <span className={`flex items-center px-3 py-1 rounded-full text-xs font-medium col-span-2 sm:col-span-1 ${
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

              {/* Badges de configuración del sorteo si existen */}
              {raffleSettings?.winPattern && raffleSettings?.prize && (
                <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
                  {/* Badge con tooltip de vista previa */}
                  <div className="group relative">
                    {/* <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full cursor-help">
                      Patrón: {patternLabel(raffleSettings.winPattern)}
                    </span> */}
                    <PatternPreview pattern={raffleSettings.winPattern} />
                    {/* <div className="hidden group-hover:block absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg p-3 whitespace-nowrap z-50 shadow-lg">
                      <div className="mb-2 font-semibold">Vista Previa:</div>
                      <PatternPreview pattern={raffleSettings.winPattern} />
                    </div> */}
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                    Premio: {raffleSettings.prize}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                    Sorteo {currentRaffle}
                  </span>
                </div>
              )}
            </div>

            {/* Sección Derecha: Desktop Only */}
            <div className="hidden lg:flex lg:flex-col lg:items-end lg:gap-4">
              {/* Botones en Desktop */}
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

              {/* Información del Jugador - Desktop */}
              <div className="flex flex-col items-end gap-2 text-sm text-gray-600">
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-700" />
                  {player?.name}
                </span>
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faGamepad} className="mr-2 text-gray-700" />
                  Cartón #{player?.cardNumber || 'Asignando...'}
                </span>
                <span className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${
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
          
        </div>

        {/* Game Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Player Card */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            {playerCard ? (
              <BingoCard 
                card={playerCard}
                calledNumbers={calledNumbers.length > 0 ? calledNumbers : (currentGame?.calledNumbers || [])}
                playerName={player?.name}
                cardNumber={player?.cardNumber}
                gameId={currentGame?.id}
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
              {/* Configuración del Sorteo */}
              <div className="bg-white/40 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                  <FontAwesomeIcon icon={faTrophy} className="mr-2" />
                  Configuración del Sorteo {currentRaffle}
                </h3>
                {raffleSettings?.winPattern && raffleSettings?.prize ? (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-200 text-purple-800 text-sm font-medium">
                      Patrón: {patternLabel(raffleSettings.winPattern)}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-200 text-green-800 text-sm font-medium">
                      Premio: {raffleSettings.prize}
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    Esperando configuración del gestor (patrón y premio) antes de iniciar.
                  </p>
                )}
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