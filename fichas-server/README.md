# Servidor Socket.io para Juego de Fichas a 100

## Instalación

1. Instalar dependencias:
```bash
cd fichas-server
npm install
```

## Ejecutar el servidor

### Modo desarrollo (con auto-reload):
```bash
npm run dev
```

### Modo producción:
```bash
npm start
```

El servidor estará corriendo en `http://localhost:3000`

## Configuración

- **Puerto**: 3000 (por defecto)
- **Socket.io path**: `/fichas-socket`
- **CORS**: Configurado para `localhost:5173` (Vite) y `localhost:3000`

## Eventos Socket.io

### Del cliente al servidor:
- `get-rooms` - Obtener lista de salas
- `create-room` - Crear nueva sala
- `join-room` - Unirse a sala
- `leave-room` - Salir de sala
- `place-bet` - Hacer apuesta
- `draw-ficha` - Pedir ficha
- `stand` - Plantarse

### Del servidor al cliente:
- `rooms-updated` - Lista de salas actualizada
- `room-joined` - Confirmación de unión a sala
- `room-left` - Confirmación de salida de sala
- `players-updated` - Lista de jugadores actualizada
- `game-state-updated` - Estado del juego actualizado
- `current-player-updated` - Turno del jugador actual
- `pot-updated` - Pozo actualizado
- `fichas-updated` - Fichas disponibles actualizadas
- `game-finished` - Juego terminado con ganador
- `error` - Mensaje de error

## Estados del juego

- `waiting` - Esperando jugadores
- `betting` - Primera ronda de apuestas
- `drawing` - Jugadores pidiendo fichas
- `rebetting` - Segunda ronda de apuestas
- `revealing` - Revelando puntajes
- `finished` - Juego terminado

## Lógica del juego

1. Se crea una sala con configuración personalizada
2. Los jugadores se unen hasta llenar cupos
3. Primera ronda de apuestas
4. Los jugadores piden fichas por turnos
5. Si un jugador supera 100, queda eliminado
6. Cuando todos terminan, segunda ronda de apuestas
7. Se revelan los puntajes
8. El más cercano a 100 gana el pozo
9. El juego se reinicia automáticamente
