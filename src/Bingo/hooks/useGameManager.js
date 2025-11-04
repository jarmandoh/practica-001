import { useState, useCallback, useEffect } from 'react';

// Hook para gestionar juegos y sorteos
export const useGameManager = () => {
  const [games, setGames] = useState([]);
  const [activeGame, setActiveGame] = useState(null);
  const [loading, setLoading] = useState(false);

  const GAMES_STORAGE_KEY = 'bingoGames';

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = () => {
    try {
      const storedGames = localStorage.getItem(GAMES_STORAGE_KEY);
      if (storedGames) {
        const parsedGames = JSON.parse(storedGames);
        setGames(parsedGames);
        
        // Encontrar juego activo
        const active = parsedGames.find(game => game.status === 'active');
        if (active) {
          setActiveGame(active);
        }
      }
    } catch (error) {
      console.error('Error al cargar juegos:', error);
    }
  };

  const saveGames = (updatedGames) => {
    localStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(updatedGames));
    setGames(updatedGames);
  };

  const createGame = useCallback((gameData) => {
    const newGame = {
      id: `game_${Date.now()}`,
      name: gameData.name,
      description: gameData.description || '',
      status: 'waiting', // waiting, active, finished
      createdAt: new Date().toISOString(),
      startedAt: null,
      finishedAt: null,
      calledNumbers: [],
      currentNumber: null,
      winners: [],
      maxPlayers: gameData.maxPlayers || 100,
      currentPlayers: 0,
      prizeAmount: gameData.prizeAmount || 0,
      settings: {
        autoMarkNumbers: gameData.autoMarkNumbers || false,
        showNumberHistory: gameData.showNumberHistory !== false,
        allowMultipleWinners: gameData.allowMultipleWinners !== false,
        winPatterns: gameData.winPatterns || ['row', 'column', 'diagonal', 'fullCard']
      }
    };

    const updatedGames = [...games, newGame];
    saveGames(updatedGames);
    return newGame;
  }, [games]);

  const startGame = useCallback((gameId) => {
    const updatedGames = games.map(game => {
      if (game.id === gameId) {
        // Finalizar cualquier juego activo anterior
        if (activeGame && activeGame.id !== gameId) {
          return game;
        }
        
        const updatedGame = {
          ...game,
          status: 'active',
          startedAt: new Date().toISOString(),
          calledNumbers: [],
          currentNumber: null,
          winners: []
        };
        
        setActiveGame(updatedGame);
        return updatedGame;
      } else if (game.status === 'active') {
        // Pasar juegos activos a finalizado
        return { ...game, status: 'finished', finishedAt: new Date().toISOString() };
      }
      return game;
    });
    
    saveGames(updatedGames);
  }, [games, activeGame]);

  const finishGame = useCallback((gameId, winners = []) => {
    const updatedGames = games.map(game => 
      game.id === gameId 
        ? { 
            ...game, 
            status: 'finished', 
            finishedAt: new Date().toISOString(),
            winners 
          }
        : game
    );
    
    saveGames(updatedGames);
    
    if (activeGame && activeGame.id === gameId) {
      setActiveGame(null);
    }
  }, [games, activeGame]);

  const updateGameState = useCallback((gameId, updates) => {
    const updatedGames = games.map(game => 
      game.id === gameId ? { ...game, ...updates } : game
    );
    
    saveGames(updatedGames);
    
    if (activeGame && activeGame.id === gameId) {
      setActiveGame({ ...activeGame, ...updates });
    }
  }, [games, activeGame]);

  const deleteGame = useCallback((gameId) => {
    const updatedGames = games.filter(game => game.id !== gameId);
    saveGames(updatedGames);
    
    if (activeGame && activeGame.id === gameId) {
      setActiveGame(null);
    }
  }, [games, activeGame]);

  const getGameById = useCallback((gameId) => {
    return games.find(game => game.id === gameId);
  }, [games]);

  const getGamesByStatus = useCallback((status) => {
    return games.filter(game => game.status === status);
  }, [games]);

  const addCalledNumber = useCallback((gameId, number) => {
    const game = getGameById(gameId);
    if (!game || game.status !== 'active') return false;

    if (game.calledNumbers.includes(number)) return false;

    const updatedCalledNumbers = [...game.calledNumbers, number];
    
    updateGameState(gameId, {
      calledNumbers: updatedCalledNumbers,
      currentNumber: number
    });
    
    return true;
  }, [getGameById, updateGameState]);

  const resetGame = useCallback((gameId) => {
    updateGameState(gameId, {
      calledNumbers: [],
      currentNumber: null,
      winners: []
    });
  }, [updateGameState]);

  const getAvailableNumbers = useCallback((gameId) => {
    const game = getGameById(gameId);
    if (!game) return [];
    
    const allNumbers = Array.from({ length: 75 }, (_, i) => i + 1);
    return allNumbers.filter(num => !game.calledNumbers.includes(num));
  }, [getGameById]);

  const getGameStats = useCallback((gameId) => {
    const game = getGameById(gameId);
    if (!game) return null;

    return {
      totalNumbers: 75,
      calledNumbers: game.calledNumbers.length,
      remainingNumbers: 75 - game.calledNumbers.length,
      progress: (game.calledNumbers.length / 75) * 100,
      winners: game.winners.length,
      duration: game.startedAt ? 
        Math.floor((new Date() - new Date(game.startedAt)) / 1000 / 60) : 0
    };
  }, [getGameById]);

  return {
    games,
    activeGame,
    loading,
    createGame,
    startGame,
    finishGame,
    updateGameState,
    deleteGame,
    getGameById,
    getGamesByStatus,
    addCalledNumber,
    resetGame,
    getAvailableNumbers,
    getGameStats,
    setActiveGame
  };
};