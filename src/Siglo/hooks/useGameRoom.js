import { useState, useCallback, useEffect } from 'react';

export const useGameRoom = (socket, playerId, playerName) => {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [players, setPlayers] = useState([]);
  const [pendingPlayers, setPendingPlayers] = useState([]);
  const [gameState, setGameState] = useState('lobby'); // lobby, betting, playing, finished
  const [betProposal, setBetProposal] = useState(null);
  const [myBetAccepted, setMyBetAccepted] = useState(false);

  // Crear sala
  const createRoom = useCallback((roomName) => {
    const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const room = {
      id: roomId,
      name: roomName,
      hostId: playerId,
      hostName: playerName,
      players: [{
        id: playerId,
        name: playerName,
        isHost: true,
        bet: 0,
        hasBet: false,
        betAccepted: false,
        score: 0,
        balls: [],
        status: 'active'
      }],
      pendingPlayers: [],
      maxPlayers: 8,
      status: 'waiting', // waiting, betting, playing, finished
      createdAt: Date.now()
    };

    // Guardar en localStorage
    const existingRooms = JSON.parse(localStorage.getItem('sigloRooms') || '[]');
    existingRooms.push(room);
    localStorage.setItem('sigloRooms', JSON.stringify(existingRooms));

    setCurrentRoom(room);
    setIsHost(true);
    setPlayers(room.players);

    // Emitir evento
    socket.emit('roomCreated', room);

    return room;
  }, [playerId, playerName, socket]);

  // Unirse a una sala
  const joinRoom = useCallback((roomId) => {
    const joinRequest = {
      roomId,
      playerId,
      playerName,
      timestamp: Date.now()
    };

    socket.emit('joinRequest', joinRequest);
  }, [playerId, playerName, socket]);

  // Aceptar jugador (solo host)
  const acceptPlayer = useCallback((pendingPlayerId) => {
    if (!isHost || !currentRoom) return;

    socket.emit('acceptPlayer', {
      roomId: currentRoom.id,
      playerId: pendingPlayerId
    });
  }, [isHost, currentRoom, socket]);

  // Rechazar jugador (solo host)
  const rejectPlayer = useCallback((pendingPlayerId) => {
    if (!isHost || !currentRoom) return;

    socket.emit('rejectPlayer', {
      roomId: currentRoom.id,
      playerId: pendingPlayerId
    });
  }, [isHost, currentRoom, socket]);

  // Proponer apuesta inicial (solo host)
  const proposeBet = useCallback((betAmount) => {
    if (!isHost || !currentRoom) return;

    const proposal = {
      roomId: currentRoom.id,
      betAmount,
      timestamp: Date.now()
    };

    socket.emit('betProposal', proposal);
  }, [isHost, currentRoom, socket]);

  // Aceptar apuesta
  const acceptBet = useCallback(() => {
    if (!currentRoom) return;

    socket.emit('acceptBet', {
      roomId: currentRoom.id,
      playerId
    });

    setMyBetAccepted(true);
  }, [currentRoom, playerId, socket]);

  // Rechazar apuesta
  const rejectBet = useCallback(() => {
    if (!currentRoom) return;

    socket.emit('rejectBet', {
      roomId: currentRoom.id,
      playerId
    });
  }, [currentRoom, playerId, socket]);

  // Iniciar juego (solo host)
  const startGame = useCallback(() => {
    if (!isHost || !currentRoom) return;

    socket.emit('startGame', {
      roomId: currentRoom.id
    });
  }, [isHost, currentRoom, socket]);

  // Sacar bolita
  const drawBall = useCallback(() => {
    if (!currentRoom) return;

    socket.emit('drawBall', {
      roomId: currentRoom.id,
      playerId
    });
  }, [currentRoom, playerId, socket]);

  // Plantarse
  const stand = useCallback(() => {
    if (!currentRoom) return;

    socket.emit('stand', {
      roomId: currentRoom.id,
      playerId
    });
  }, [currentRoom, playerId, socket]);

  // Salir de la sala
  const leaveRoom = useCallback(() => {
    if (!currentRoom) return;

    socket.emit('leaveRoom', {
      roomId: currentRoom.id,
      playerId
    });

    setCurrentRoom(null);
    setIsHost(false);
    setPlayers([]);
    setPendingPlayers([]);
    setGameState('lobby');
    setBetProposal(null);
    setMyBetAccepted(false);
  }, [currentRoom, playerId, socket]);

  // Listeners de eventos del socket
  useEffect(() => {
    if (!socket) return;

    // Actualización de salas
    const handleRoomsList = (roomsList) => {
      setRooms(roomsList);
    };

    // Solicitud de unión recibida (solo host)
    const handleJoinRequest = (request) => {
      if (currentRoom && request.roomId === currentRoom.id && isHost) {
        setPendingPlayers(prev => [...prev, request]);
      }
    };

    // Jugador aceptado
    const handlePlayerAccepted = (data) => {
      if (data.playerId === playerId) {
        // Yo fui aceptado
        setCurrentRoom(data.room);
        setPlayers(data.room.players);
        setGameState('lobby');
      } else if (currentRoom && data.roomId === currentRoom.id) {
        // Otro jugador fue aceptado
        setPlayers(data.room.players);
        setPendingPlayers(prev => prev.filter(p => p.playerId !== data.playerId));
      }
    };

    // Jugador rechazado
    const handlePlayerRejected = (data) => {
      if (data.playerId === playerId) {
        alert('Tu solicitud para unirte fue rechazada');
      } else if (currentRoom && data.roomId === currentRoom.id) {
        setPendingPlayers(prev => prev.filter(p => p.playerId !== data.playerId));
      }
    };

    // Propuesta de apuesta recibida
    const handleBetProposal = (proposal) => {
      if (currentRoom && proposal.roomId === currentRoom.id) {
        setBetProposal(proposal);
        setGameState('betting');
        setMyBetAccepted(false);
      }
    };

    // Estado de apuestas actualizado
    const handleBetStatus = (data) => {
      if (currentRoom && data.roomId === currentRoom.id) {
        setPlayers(data.players);
      }
    };

    // Juego iniciado
    const handleGameStarted = (data) => {
      if (currentRoom && data.roomId === currentRoom.id) {
        setGameState('playing');
        setCurrentRoom(data.room);
      }
    };

    // Bolita sacada
    const handleBallDrawn = (data) => {
      if (currentRoom && data.roomId === currentRoom.id) {
        setPlayers(data.players);
      }
    };

    // Turno cambiado
    const handleTurnChanged = (data) => {
      if (currentRoom && data.roomId === currentRoom.id) {
        setCurrentRoom(prev => ({ ...prev, currentTurn: data.currentTurn }));
      }
    };

    // Jugador eliminado
    const handlePlayerEliminated = (data) => {
      if (currentRoom && data.roomId === currentRoom.id) {
        setPlayers(data.players);
      }
    };

    // Juego terminado
    const handleGameFinished = (data) => {
      if (currentRoom && data.roomId === currentRoom.id) {
        setGameState('finished');
        setPlayers(data.players);
        setCurrentRoom(prev => ({ ...prev, winner: data.winner }));
      }
    };

    // Jugador salió
    const handlePlayerLeft = (data) => {
      if (currentRoom && data.roomId === currentRoom.id) {
        setPlayers(data.players);
        if (data.playerId === playerId) {
          leaveRoom();
        }
      }
    };

    // Registrar listeners
    socket.on('roomsList', handleRoomsList);
    socket.on('joinRequest', handleJoinRequest);
    socket.on('playerAccepted', handlePlayerAccepted);
    socket.on('playerRejected', handlePlayerRejected);
    socket.on('betProposal', handleBetProposal);
    socket.on('betStatus', handleBetStatus);
    socket.on('gameStarted', handleGameStarted);
    socket.on('ballDrawn', handleBallDrawn);
    socket.on('turnChanged', handleTurnChanged);
    socket.on('playerEliminated', handlePlayerEliminated);
    socket.on('gameFinished', handleGameFinished);
    socket.on('playerLeft', handlePlayerLeft);

    // Cleanup
    return () => {
      socket.off('roomsList', handleRoomsList);
      socket.off('joinRequest', handleJoinRequest);
      socket.off('playerAccepted', handlePlayerAccepted);
      socket.off('playerRejected', handlePlayerRejected);
      socket.off('betProposal', handleBetProposal);
      socket.off('betStatus', handleBetStatus);
      socket.off('gameStarted', handleGameStarted);
      socket.off('ballDrawn', handleBallDrawn);
      socket.off('turnChanged', handleTurnChanged);
      socket.off('playerEliminated', handlePlayerEliminated);
      socket.off('gameFinished', handleGameFinished);
      socket.off('playerLeft', handlePlayerLeft);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, currentRoom, isHost, playerId]);

  return {
    currentRoom,
    rooms,
    isHost,
    players,
    pendingPlayers,
    gameState,
    betProposal,
    myBetAccepted,
    createRoom,
    joinRoom,
    acceptPlayer,
    rejectPlayer,
    proposeBet,
    acceptBet,
    rejectBet,
    startGame,
    drawBall,
    stand,
    leaveRoom
  };
};
