import React, { createContext, useEffect, useState } from 'react';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // En un entorno real, conectarías a tu servidor de sockets
    // Por ahora, simularemos la funcionalidad sin servidor real
    const mockSocket = {
      emit: (event, data) => {
        console.log('Socket emit:', event, data);
        // Simular emisión de eventos
        if (event === 'numberDrawn') {
          // Simular broadcast a todos los clientes
          setTimeout(() => {
            mockSocket.onNumberDrawn?.(data);
          }, 100);
        }
      },
      on: (event, callback) => {
        console.log('Socket listening for:', event);
        if (event === 'numberDrawn') {
          mockSocket.onNumberDrawn = callback;
        }
      },
      off: (event) => {
        console.log('Socket stop listening for:', event);
        if (event === 'numberDrawn') {
          mockSocket.onNumberDrawn = null;
        }
      },
      disconnect: () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      }
    };

    setSocket(mockSocket);
    setIsConnected(true);

    return () => {
      if (mockSocket) {
        mockSocket.disconnect();
      }
    };
  }, []);

  const value = {
    socket,
    isConnected
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};