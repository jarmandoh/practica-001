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
      connected: true, // Propiedad para verificar conexión
      id: `socket_${Date.now()}`, // ID único del socket

      emit: (event, data, callback) => {
        console.log('Socket emit:', event, data);
        
        // Enviar a otras pestañas
        channel.postMessage({ type: event, data });

        // También disparar localmente para sincronización inmediata
        setTimeout(() => {
          mockSocket._trigger(event, data);
        }, 0);

        // Ejecutar callback si existe (para acknowledgments)
        if (typeof callback === 'function') {
          setTimeout(() => {
            callback({ success: true });
          }, 10);
        }
      },

      on: (event, callback) => {
        console.log('Socket listening for:', event);
        if (!mockSocket._listeners[event]) {
          mockSocket._listeners[event] = [];
        }
        mockSocket._listeners[event].push(callback);

        // Disparar evento connect si ya está conectado
        if (event === 'connect' && mockSocket.connected) {
          setTimeout(() => callback(), 0);
        }
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
          mockSocket._listeners[event].forEach(cb => {
            try {
              cb(data);
            } catch (error) {
              console.error(`Error en listener de ${event}:`, error);
            }
          });
        }
      },

      disconnect: () => {
        console.log('Socket disconnected');
        mockSocket.connected = false;
        mockSocket._trigger('disconnect');
        setIsConnected(false);
      },

      connect: () => {
        console.log('Socket connecting...');
        mockSocket.connected = true;
        setIsConnected(true);
        mockSocket._trigger('connect');
        console.log('Socket connected');
      }
    };

    // Escuchar mensajes de otras pestañas
    channel.onmessage = (msg) => {
      const { type, data } = msg.data;
      console.log('Socket received from channel:', type, data);
      mockSocket._trigger(type, data);
    };

    // Manejar errores del canal
    channel.onerror = (error) => {
      console.error('BroadcastChannel error:', error);
    };

    setSocket(mockSocket);
    setIsConnected(true);

    // Disparar evento de conexión inicial
    setTimeout(() => {
      mockSocket._trigger('connect');
    }, 100);

    // Mantener conexión activa con heartbeat
    const heartbeatInterval = setInterval(() => {
      if (!mockSocket.connected) {
        console.log('Reconectando socket...');
        mockSocket.connect();
      }
    }, 5000); // Verificar cada 5 segundos

    return () => {
      clearInterval(heartbeatInterval);
      channel.close();
      if (mockSocket.connected) {
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
      {/* Indicador de estado de conexión global (opcional) */}
      {socket && !socket.connected && (
        <div 
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            backgroundColor: '#ef4444',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 9999,
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          🔌 Desconectado - Verificando conexión...
        </div>
      )}
    </SocketContext.Provider>
  );
};