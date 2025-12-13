# Juego de Fichas a 100

## Descripción
Un juego multijugador donde los participantes deben acercarse lo más posible a 100 puntos sin pasarse, utilizando fichas únicas numeradas del 1 al 99.

## Características Principales

### Sistema de Salas
- Las salas las crea el administrador o gestor
- Configuración personalizable: jugadores máximos, apuesta mínima, fichas iniciales
- Las salas se cierran al completar cupos o cuando todos los jugadores estén listos
- Sistema de turnos ordenado

### Sistema de Apuestas
- Apuesta obligatoria al iniciar cada ronda
- Segunda ronda de apuestas después de que todos los jugadores terminen su turno
- El pozo acumulado se lo lleva el ganador

### Mecánica del Juego

1. **Fase de Apuesta Inicial**
   - Cada jugador debe hacer una apuesta antes de que comience el juego
   - Una vez todos hayan apostado, inicia el reparto de fichas

2. **Fase de Juego**
   - El primer jugador pide fichas (números del 1-99) hasta que indique "plantarse"
   - El turno pasa al siguiente jugador
   - Si un jugador supera los 100 puntos, queda eliminado
   - Continúa hasta que todos los jugadores hayan tenido su turno

3. **Segunda Ronda de Apuestas**
   - Después del último turno, los jugadores vuelven a apostar
   - Una vez todos apuesten, no se pueden repartir más fichas

4. **Revelación y Ganador**
   - Se revelan los puntajes de todos los jugadores
   - Gana quien esté más cerca de 100 sin pasarse
   - El ganador se lleva todo el pozo de apuestas
   - El juego reinicia para una nueva ronda

## Estructura del Proyecto

```
src/Fichas/
├── components/          # Componentes reutilizables
│   ├── AdminLogin/     # Login de administrador
│   ├── PlayerLogin/    # Login de jugador
│   ├── GestorLogin/    # Login de gestor
│   ├── RoomCard/       # Tarjeta de sala
│   ├── CreateRoomModal/# Modal para crear salas
│   └── GameBoard/      # Tablero principal del juego
├── context/
│   └── SocketContext.jsx  # Contexto de WebSocket
├── data/
│   └── gameConfig.js   # Configuración del juego
├── hooks/              # Hooks personalizados
│   ├── useSocket.js
│   ├── usePlayerAuth.js
│   ├── useAdminAuth.js
│   ├── useGestorAuth.js
│   └── useGameManager.js
├── pages/              # Páginas principales
│   ├── FichasLanding.jsx
│   ├── FichasPlayer.jsx
│   ├── FichasAdmin.jsx
│   ├── FichasGestor.jsx
│   └── Protected*.jsx  # Páginas protegidas
└── index.js           # Exportaciones
```

## Roles

### Jugador
- Unirse a salas disponibles
- Hacer apuestas
- Pedir fichas en su turno
- Plantarse cuando lo desee

### Administrador
- Crear salas con configuración personalizada
- Ver estadísticas generales
- Supervisar todas las salas activas
- Acceso con contraseña: `admin123`

### Gestor
- Crear y administrar salas
- Ver el estado de sus salas
- Gestionar jugadores en sus salas
- Acceso con contraseña: `gestor123`

## Configuración del Juego

```javascript
GAME_CONFIG = {
  MIN_PLAYERS: 2,        // Mínimo de jugadores
  MAX_PLAYERS: 6,        // Máximo de jugadores
  MIN_BET: 10,          // Apuesta mínima
  MAX_BET: 1000,        // Apuesta máxima
  DEFAULT_CHIPS: 1000,  // Fichas iniciales
  TARGET_SCORE: 100,    // Puntaje objetivo
  FICHAS_RANGE: {       // Rango de fichas
    MIN: 1,
    MAX: 99
  }
}
```

## Estados del Juego

- **WAITING**: Esperando jugadores
- **BETTING**: Primera ronda de apuestas
- **DRAWING**: Jugadores pidiendo fichas
- **REBETTING**: Segunda ronda de apuestas
- **REVEALING**: Revelando puntajes
- **FINISHED**: Juego terminado

## Integración con Socket.io

El juego requiere un servidor Socket.io configurado. La ruta del socket es:
- Path: `/fichas-socket`
- URL por defecto: `http://localhost:3000`

### Eventos principales:
- `create-room`: Crear nueva sala
- `join-room`: Unirse a sala
- `leave-room`: Salir de sala
- `place-bet`: Hacer apuesta
- `draw-ficha`: Pedir ficha
- `stand`: Plantarse
- `rooms-updated`: Actualización de salas
- `game-state-updated`: Actualización del estado del juego

## Instalación

1. Asegúrate de tener instaladas las dependencias:
```bash
npm install socket.io-client react-router-dom
```

2. Configura la URL del servidor Socket.io en `.env`:
```
VITE_SOCKET_URL=http://localhost:3000
```

3. Importa el juego en tu aplicación principal:
```javascript
import { FichasLanding, ProtectedFichasPlayer, ProtectedFichasAdmin, ProtectedFichasGestor } from './Fichas';
```

## Uso

### En tu archivo de rutas (App.jsx o similar):

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FichasSocketProvider } from './Fichas/context/SocketContext';
import { 
  FichasLanding, 
  ProtectedFichasPlayer, 
  ProtectedFichasAdmin, 
  ProtectedFichasGestor 
} from './Fichas';

function App() {
  return (
    <BrowserRouter>
      <FichasSocketProvider>
        <Routes>
          <Route path="/fichas" element={<FichasLanding />} />
          <Route path="/fichas/player" element={<ProtectedFichasPlayer />} />
          <Route path="/fichas/admin" element={<ProtectedFichasAdmin />} />
          <Route path="/fichas/gestor" element={<ProtectedFichasGestor />} />
        </Routes>
      </FichasSocketProvider>
    </BrowserRouter>
  );
}
```

## Notas Importantes

- Las fichas son únicas: cada número del 1-99 solo puede ser usado una vez por ronda
- Si un jugador se elimina (supera 100), no puede ganar pero su apuesta permanece en el pozo
- En caso de empate (dos jugadores con el mismo puntaje cercano a 100), se reparte el pozo
- El juego reinicia automáticamente después de determinar un ganador

## Próximas Mejoras

- [ ] Sistema de estadísticas por jugador
- [ ] Historial de juegos
- [ ] Chat en tiempo real
- [ ] Torneos
- [ ] Logros y recompensas
- [ ] Modo espectador

## Licencia

Este proyecto es parte de una práctica educativa de React + Vite.
