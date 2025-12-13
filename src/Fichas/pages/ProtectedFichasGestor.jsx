import React from 'react';
import { useGestorAuth } from '../hooks/useGestorAuth';
import GestorLogin from '../components/GestorLogin';
import FichasGestor from './FichasGestor';

const ProtectedFichasGestor = () => {
  const { isAuthenticated, login } = useGestorAuth();

  if (!isAuthenticated) {
    return <GestorLogin onLogin={login} />;
  }

  return <FichasGestor />;
};

export default ProtectedFichasGestor;
