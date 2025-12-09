import { useState, useCallback } from 'react';

export const useSigloGame = () => {
  const [gameState, setGameState] = useState({
    players: [],
    currentPlayerIndex: 0,
    availableBalls: [],
    gameStatus: 'waiting', // waiting, betting, playing, finished, revealing
    winner: null,
    gameId: null,
    showAllTotals: false, // Para revelar todos los totales
    totalPot: 0, // Pozo total de apuestas
    allPlayersBet: false // Indica si todos los jugadores apostaron
  });

  // Inicializar el juego
  const initializeGame = useCallback((playerNames) => {
    // Crear jugadores
    const players = playerNames.map((name, index) => ({
      id: index + 1,
      name,
      balls: [],
      total: 0,
      bet: 0,
      hasBet: false,
      status: 'active', // active, eliminated, winner
      isPlaying: index === 0
    }));

    setGameState({
      players,
      currentPlayerIndex: 0,
      availableBalls: [],
      gameStatus: 'betting',
      winner: null,
      gameId: Date.now(),
      totalPot: 0,
      allPlayersBet: false,
      showAllTotals: false
    });

    return { players };
  }, []);

  // Registrar apuesta de un jugador
  const placeBet = useCallback((playerId, betAmount) => {
    const updatedPlayers = gameState.players.map(player => {
      if (player.id === playerId) {
        return {
          ...player,
          bet: betAmount,
          hasBet: true
        };
      }
      return player;
    });

    const totalPot = updatedPlayers.reduce((sum, p) => sum + p.bet, 0);
    const allPlayersBet = updatedPlayers.every(p => p.hasBet);

    setGameState(prev => ({
      ...prev,
      players: updatedPlayers,
      totalPot,
      allPlayersBet
    }));
  }, [gameState]);

  // Iniciar el juego después de las apuestas
  const startGame = useCallback(() => {
    // Crear array de bolitas del 1 al 99
    const balls = Array.from({ length: 99 }, (_, i) => i + 1);
    
    // Mezclar las bolitas
    const shuffledBalls = balls.sort(() => Math.random() - 0.5);

    setGameState(prev => ({
      ...prev,
      availableBalls: shuffledBalls,
      gameStatus: 'playing'
    }));
  }, []);

  // Sacar una bolita
  const drawBall = useCallback(() => {
    if (gameState.availableBalls.length === 0) {
      return null;
    }

    const drawnBall = gameState.availableBalls[0];
    const remainingBalls = gameState.availableBalls.slice(1);

    const updatedPlayers = gameState.players.map((player, index) => {
      if (index === gameState.currentPlayerIndex) {
        const newBalls = [...player.balls, drawnBall];
        const newTotal = newBalls.reduce((sum, ball) => sum + ball, 0);
        const isEliminated = newTotal > 100;

        return {
          ...player,
          balls: newBalls,
          total: newTotal,
          status: isEliminated ? 'eliminated' : player.status
        };
      }
      return player;
    });

    setGameState(prev => ({
      ...prev,
      players: updatedPlayers,
      availableBalls: remainingBalls
    }));

    return drawnBall;
  }, [gameState]);

  // Pasar turno al siguiente jugador
  const passTurn = useCallback(() => {
    const activePlayers = gameState.players.filter(p => p.status === 'active');
    
    if (activePlayers.length === 0) {
      // Todos eliminados, el juego termina
      setGameState(prev => ({
        ...prev,
        gameStatus: 'finished',
        winner: null
      }));
      return;
    }

    // Buscar el siguiente jugador activo
    let nextIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    let attempts = 0;
    
    while (gameState.players[nextIndex].status !== 'active' && attempts < gameState.players.length) {
      nextIndex = (nextIndex + 1) % gameState.players.length;
      attempts++;
    }

    // Si no hay más jugadores activos, pasar a fase de revelación
    if (attempts >= gameState.players.length) {
      setGameState(prev => ({
        ...prev,
        gameStatus: 'revealing'
      }));
      return;
    }

    setGameState(prev => ({
      ...prev,
      currentPlayerIndex: nextIndex,
      players: prev.players.map((p, i) => ({
        ...p,
        isPlaying: i === nextIndex
      }))
    }));
  }, [gameState]);

  // Terminar la ronda y revelar todos los totales
  const endRound = useCallback(() => {
    const winner = gameState.players
      .filter(p => p.status === 'active' && p.total <= 100)
      .sort((a, b) => b.total - a.total)[0];

    setGameState(prev => ({
      ...prev,
      gameStatus: 'finished',
      showAllTotals: true,
      winner: winner || null,
      players: prev.players.map(p => 
        p.id === winner?.id ? { ...p, status: 'winner' } : p
      )
    }));
  }, [gameState]);

  // Reiniciar el juego
  const resetGame = useCallback(() => {
    setGameState({
      players: [],
      currentPlayerIndex: 0,
      availableBalls: [],
      gameStatus: 'waiting',
      winner: null,
      gameId: null,
      showAllTotals: false,
      totalPot: 0,
      allPlayersBet: false
    });
  }, []);

  // Obtener el jugador actual
  const getCurrentPlayer = useCallback(() => {
    return gameState.players[gameState.currentPlayerIndex];
  }, [gameState]);

  return {
    gameState,
    initializeGame,
    placeBet,
    startGame,
    drawBall,
    passTurn,
    endRound,
    resetGame,
    getCurrentPlayer
  };
};
