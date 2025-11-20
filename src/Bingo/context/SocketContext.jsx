import React, { createContext, useEffect, useState } from 'react';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Usar BroadcastChannel para comunicación entre pestañas
    const channel = new BroadcastChannel('bingo_game_channel');

    const mockSocket = {
      _listeners: {},

      emit: (event, data) => {
        console.log('Socket emit:', event, data);
        // Enviar a otras pestañas
        channel.postMessage({ type: event, data });

        // También disparar localmente si es necesario
        // mockSocket._trigger(event, data);
      },

      on: (event, callback) => {
        console.log('Socket listening for:', event);
        if (!mockSocket._listeners[event]) {
          mockSocket._listeners[event] = [];
        }
        mockSocket._listeners[event].push(callback);
      },

      off: (event, callback) => {
        console.log('Socket stop listening for:', event);
        if (mockSocket._listeners[event]) {
          if (callback) {
            mockSocket._listeners[event] = mockSocket._listeners[event].filter(cb => cb !== callback);
          } else {
            delete mockSocket._listeners[event];
          }
        }
      },

      _trigger: (event, data) => {
        if (mockSocket._listeners[event]) {
          mockSocket._listeners[event].forEach(cb => cb(data));
        }
      },

      disconnect: () => {
        console.log('Socket disconnected');
        channel.close();
        setIsConnected(false);
      }
    };

    // Escuchar mensajes de otras pestañas
    channel.onmessage = (msg) => {
      const { type, data } = msg.data;
      console.log('Socket received from channel:', type, data);
      mockSocket._trigger(type, data);
    };

    setSocket(mockSocket);
    setIsConnected(true);

    return () => {
      mockSocket.disconnect();
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