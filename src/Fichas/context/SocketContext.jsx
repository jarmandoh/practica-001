import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { SocketContext } from './SocketContext.js';

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
