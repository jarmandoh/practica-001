import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faRedo, faHome } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import PlayerCard from '../components/PlayerCard';
import GameControls from '../components/GameControls';
import PlayerSetup from '../components/PlayerSetup';
import BettingPhase from '../components/BettingPhase';
import { useSigloGame } from '../hooks/useSigloGame';

const SigloGame = () => {
  const { gameState, initializeGame, placeBet, startGame, drawBall, passTurn, endRound, resetGame, getCurrentPlayer } = useSigloGame();
  const [lastDrawnBall, setLastDrawnBall] = useState(null);
  const [showBallAnimation, setShowBallAnimation] = useState(false);
  const [timers, setTimers] = useState([]);

  useEffect(() => {
    document.title = 'Juego del Siglo';
    
    // Cleanup: cancelar todos los timers al desmontar
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [timers]);

  const handleStartGame = (playerNames) => {
    initializeGame(playerNames);
  };

  const handleDrawBall = () => {
    const ball = drawBall();
    if (ball !== null) {
      setLastDrawnBall(ball);
      setShowBallAnimation(true);
      
      const timer1 = setTimeout(() => {
        setShowBallAnimation(false);
        
        // Verificar si el jugador fue eliminado
        const currentPlayer = getCurrentPlayer();
        if (currentPlayer && currentPlayer.status === 'eliminated') {
          const timer2 = setTimeout(() => {
            passTurn();
          }, 2000);
          setTimers(prev => [...prev, timer2]);
        }
      }, 2000);
      
      setTimers(prev => [...prev, timer1]);
    }
  };

  const handlePass = () => {
    setLastDrawnBall(null);
    passTurn();
  };

  const handleReset = () => {
    // Cancelar todos los timers pendientes
    timers.forEach(timer => clearTimeout(timer));
    setTimers([]);
    
    setLastDrawnBall(null);
    setShowBallAnimation(false);
    resetGame();
  };

  if (gameState.gameStatus === 'waiting') {
    return <PlayerSetup onStartGame={handleStartGame} />;
  }

  if (gameState.gameStatus === 'betting') {
    return (
      <BettingPhase
        players={gameState.players}
        onPlaceBet={placeBet}
        onStartGame={startGame}
        totalPot={gameState.totalPot}
        allPlayersBet={gameState.allPlayersBet}
      />
    );
  }

  const currentPlayer = getCurrentPlayer();
  const activePlayers = gameState.players.filter(p => p.status === 'active');

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-100 via-pink-100 to-red-100 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">🎲 Juego del Siglo</h1>
              <p className="text-gray-600">
                {gameState.gameStatus === 'playing' 
                  ? `Jugadores activos: ${activePlayers.length}` 
                  : 'Juego terminado'}
              </p>
              {gameState.totalPot > 0 && (
                <div className="mt-2 inline-block bg-yellow-100 border-2 border-yellow-400 rounded-lg px-4 py-2">
                  <span className="text-yellow-800 font-bold">💰 Pozo: </span>
                  <span className="text-yellow-900 font-bold text-lg">
                    {new Intl.NumberFormat('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                      minimumFractionDigits: 0
                    }).format(gameState.totalPot)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Link
                to="/"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center"
              >
                <FontAwesomeIcon icon={faHome} className="mr-2" />
                Inicio
              </Link>
              <button
                onClick={handleReset}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center"
              >
                <FontAwesomeIcon icon={faRedo} className="mr-2" />
                Nuevo Juego
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animación de bolita sacada */}
      {showBallAnimation && lastDrawnBall !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-12 shadow-2xl animate-bounce">
            <div className="text-center">
              <div className="w-40 h-40 bg-linear-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center shadow-xl mx-auto mb-6">
                <span className="text-6xl font-bold text-white">{lastDrawnBall}</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{currentPlayer?.name}</p>
              <p className="text-gray-600 mt-2">ha sacado esta bolita</p>
            </div>
          </div>
        </div>
      )}

      {/* Ganador */}
      {gameState.gameStatus === 'finished' && gameState.winner && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-linear-to-r from-yellow-400 to-orange-500 rounded-xl shadow-2xl p-8 text-center animate-pulse">
            <FontAwesomeIcon icon={faTrophy} className="text-6xl text-white mb-4" />
            <h2 className="text-4xl font-bold text-white mb-2">¡Tenemos un ganador!</h2>
            <p className="text-2xl text-white font-semibold">{gameState.winner.name}</p>
            <p className="text-xl text-white mt-2">Puntuación: {gameState.winner.total}/100</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Controles */}
          <div className="lg:col-span-1">
            {gameState.gameStatus === 'playing' && (
              <>
                <GameControls
                  onDrawBall={handleDrawBall}
                  onPass={handlePass}
                  currentPlayer={currentPlayer}
                  disabled={showBallAnimation}
                  ballsRemaining={gameState.availableBalls.length}
                />
                
                <div className="mt-4 bg-white rounded-xl shadow-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Control del Administrador</h3>
                  <button
                    onClick={endRound}
                    className="w-full bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                  >
                    <FontAwesomeIcon icon={faTrophy} className="mr-2" />
                    Terminar Ronda y Revelar Ganador
                  </button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Esto mostrará todos los totales y declarará al ganador
                  </p>
                </div>
              </>
            )}

            {gameState.gameStatus === 'finished' && (
              <div className="bg-white rounded-xl shadow-2xl p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Estadísticas Finales</h3>
                <div className="space-y-3">
                  {gameState.players
                    .sort((a, b) => {
                      if (a.status === 'winner') return -1;
                      if (b.status === 'winner') return 1;
                      if (a.status === 'eliminated' && b.status !== 'eliminated') return 1;
                      if (b.status === 'eliminated' && a.status !== 'eliminated') return -1;
                      return b.total - a.total;
                    })
                    .map((player, index) => (
                      <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-bold text-gray-800">
                            {index + 1}. {player.name}
                          </span>
                          {player.status === 'winner' && (
                            <FontAwesomeIcon icon={faTrophy} className="ml-2 text-yellow-500" />
                          )}
                        </div>
                        <span className={`font-bold ${
                          player.status === 'eliminated' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {player.total}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha - Jugadores */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-4">
              {gameState.players.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  isCurrentPlayer={player.id === currentPlayer?.id && gameState.gameStatus === 'playing'}
                  showAllTotals={gameState.showAllTotals}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigloGame;
