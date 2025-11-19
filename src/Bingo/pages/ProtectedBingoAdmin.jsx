import React, { useEffect } from 'react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import AdminLogin from '../components/AdminLogin';
import BingoAdmin from './BingoAdmin';

const ProtectedBingoAdmin = () => {
  const { isAuthenticated, isLoading, login } = useAdminAuth();

  useEffect(() => {
    document.title = isAuthenticated ? 'Administrador | Bingo Game' : 'Login Administrador | Bingo';
  }, [isAuthenticated]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-600 to-blue-600 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-2xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    return <AdminLogin onLogin={login} />;
  }

  // Si está autenticado, mostrar el administrador
  return <BingoAdmin />;
};

export default ProtectedBingoAdmin;