import { useState, useEffect } from 'react';

export const usePlayerAuth = () => {
  const [playerData, setPlayerData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si hay datos de jugador guardados
    const savedPlayer = localStorage.getItem('fichasPlayerData');
    if (savedPlayer) {
      const data = JSON.parse(savedPlayer);
      setPlayerData(data);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username) => {
    const data = {
      username,
      id: Date.now().toString(),
      chips: 1000,
      joinedAt: new Date().toISOString(),
    };
    localStorage.setItem('fichasPlayerData', JSON.stringify(data));
    setPlayerData(data);
    setIsAuthenticated(true);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('fichasPlayerData');
    setPlayerData(null);
    setIsAuthenticated(false);
  };

  return {
    playerData,
    isAuthenticated,
    login,
    logout,
  };
};

export default usePlayerAuth;
