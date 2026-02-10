import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext(null);

export const useFichasSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useFichasSocket debe usarse dentro de FichasSocketProvider');
  }
  return context;
};

export const FichasSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Conectar al servidor de Socket.io
    const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000', {
      path: '/fichas-socket',
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('Conectado al servidor de Fichas');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Desconectado del servidor de Fichas');
      setConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};
