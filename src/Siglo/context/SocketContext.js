// Mock de Socket.io usando BroadcastChannel para simular comunicación en tiempo real
class MockSocket {
  constructor() {
    this.channel = new BroadcastChannel('siglo_game_channel');
    this.listeners = new Map();
    this.connected = true;
    this.id = `socket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Escuchar mensajes del canal
    this.handleMessage = (event) => {
      const { type, data, senderId } = event.data;
      
      // No procesar mensajes propios
      if (senderId === this.id) return;
      
      // Ejecutar listeners registrados
      if (this.listeners.has(type)) {
        this.listeners.get(type).forEach(callback => callback(data));
      }
    };
    
    this.channel.addEventListener('message', this.handleMessage);
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event).filter(cb => cb !== callback);
      this.listeners.set(event, callbacks);
    }
  }

  emit(event, data) {
    if (!this.connected) return;
    
    // Enviar mensaje por el canal
    this.channel.postMessage({
      type: event,
      data,
      senderId: this.id
    });

    // También procesar localmente para el emisor
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  disconnect() {
    this.connected = false;
    this.channel.removeEventListener('message', this.handleMessage);
    this.channel.close();
    this.listeners.clear();
  }
}

// Singleton para evitar múltiples instancias
let socketInstance = null;

// Hook para usar Socket
export const useSigloSocket = () => {
  if (!socketInstance) {
    socketInstance = new MockSocket();
  }
  
  return socketInstance;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

export default MockSocket;
