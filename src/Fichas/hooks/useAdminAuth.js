import { useState, useEffect } from 'react';

const ADMIN_PASSWORD = 'admin123'; // En producción, esto debería venir del servidor

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    // Verificar si hay sesión de admin guardada
    const savedAdmin = localStorage.getItem('fichasAdminData');
    if (savedAdmin) {
      const data = JSON.parse(savedAdmin);
      setAdminData(data);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (password) => {
    if (password === ADMIN_PASSWORD) {
      const data = {
        role: 'admin',
        loginAt: new Date().toISOString(),
      };
      localStorage.setItem('fichasAdminData', JSON.stringify(data));
      setAdminData(data);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: 'Contraseña incorrecta' };
  };

  const logout = () => {
    localStorage.removeItem('fichasAdminData');
    setAdminData(null);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    adminData,
    login,
    logout,
  };
};

export default useAdminAuth;
