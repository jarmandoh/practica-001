import { useState, useEffect } from 'react';

const GESTOR_PASSWORD = 'gestor123'; // En producción, esto debería venir del servidor

export const useGestorAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [gestorData, setGestorData] = useState(null);

  useEffect(() => {
    // Verificar si hay sesión de gestor guardada
    const savedGestor = localStorage.getItem('fichasGestorData');
    if (savedGestor) {
      const data = JSON.parse(savedGestor);
      setGestorData(data);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (password) => {
    if (password === GESTOR_PASSWORD) {
      const data = {
        role: 'gestor',
        loginAt: new Date().toISOString(),
      };
      localStorage.setItem('fichasGestorData', JSON.stringify(data));
      setGestorData(data);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: 'Contraseña incorrecta' };
  };

  const logout = () => {
    localStorage.removeItem('fichasGestorData');
    setGestorData(null);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    gestorData,
    login,
    logout,
  };
};

export default useGestorAuth;
