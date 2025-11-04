import React from 'react';
import { usePlayerAuth } from '../hooks/usePlayerAuth';
import PlayerLogin from '../components/PlayerLogin';
import BingoPlayer from './BingoPlayer';

const ProtectedBingoPlayer = () => {
  const { isAuthenticated, isLoading, loginPlayer } = usePlayerAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-600 to-blue-600 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-2xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    return <PlayerLogin onLogin={loginPlayer} />;
  }

  // Si está autenticado, mostrar la vista de jugador
  return <BingoPlayer />;
};

export default ProtectedBingoPlayer;