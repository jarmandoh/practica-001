import React from 'react';
import { usePlayerAuth } from '../hooks/usePlayerAuth';
import PlayerLogin from '../components/PlayerLogin';
import FichasPlayer from './FichasPlayer';

const ProtectedFichasPlayer = () => {
  const { isAuthenticated, login } = usePlayerAuth();

  if (!isAuthenticated) {
    return <PlayerLogin onLogin={login} />;
  }

  return <FichasPlayer />;
};

export default ProtectedFichasPlayer;
