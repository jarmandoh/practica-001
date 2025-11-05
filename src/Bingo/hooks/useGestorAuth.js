import { useState, useEffect } from 'react';

export const useGestorAuth = () => {
  const [gestor, setGestor] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay sesión de gestor activa
    const gestorSession = localStorage.getItem('gestorSession');
    if (gestorSession) {
      try {
        const session = JSON.parse(gestorSession);
        const now = new Date().getTime();
        
        // Verificar si la sesión no ha expirado (24 horas)
        if (session.expiresAt > now) {
          setGestor(session);
          setIsAuthenticated(true);
        } else {
          // Sesión expirada
          localStorage.removeItem('gestorSession');
        }
      } catch (error) {
        console.error('Error parsing gestor session:', error);
        localStorage.removeItem('gestorSession');
      }
    }
    setLoading(false);
  }, []);

  const loginGestor = (gameId, password, gestorName) => {
    // Obtener el juego para verificar la contraseña
    const games = JSON.parse(localStorage.getItem('bingoGames') || '[]');
    const game = games.find(g => g.id === gameId);
    
    if (!game) {
      throw new Error('Juego no encontrado');
    }

    if (!game.gestorPassword) {
      throw new Error('Este juego no tiene contraseña de gestor configurada');
    }

    if (game.gestorPassword !== password) {
      throw new Error('Contraseña incorrecta');
    }

    // Crear sesión de gestor
    const gestorSession = {
      id: Date.now(),
      name: gestorName,
      gameId: gameId,
      gameName: game.name,
      loginTime: new Date().toISOString(),
      expiresAt: new Date().getTime() + (24 * 60 * 60 * 1000) // 24 horas
    };

    localStorage.setItem('gestorSession', JSON.stringify(gestorSession));
    setGestor(gestorSession);
    setIsAuthenticated(true);

    return gestorSession;
  };

  const logoutGestor = () => {
    localStorage.removeItem('gestorSession');
    setGestor(null);
    setIsAuthenticated(false);
  };

  const getTimeUntilExpiry = () => {
    if (!gestor) return { valid: false };

    const now = new Date().getTime();
    const timeLeft = gestor.expiresAt - now;

    if (timeLeft <= 0) {
      logoutGestor();
      return { valid: false };
    }

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    return {
      valid: true,
      hours,
      minutes,
      totalMs: timeLeft
    };
  };

  return {
    gestor,
    isAuthenticated,
    loading,
    loginGestor,
    logoutGestor,
    getTimeUntilExpiry
  };
};