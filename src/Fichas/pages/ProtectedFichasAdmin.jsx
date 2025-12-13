import React from 'react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import AdminLogin from '../components/AdminLogin';
import FichasAdmin from './FichasAdmin';

const ProtectedFichasAdmin = () => {
  const { isAuthenticated, login } = useAdminAuth();

  if (!isAuthenticated) {
    return <AdminLogin onLogin={login} />;
  }

  return <FichasAdmin />;
};

export default ProtectedFichasAdmin;
