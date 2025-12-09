import React, { useState, useEffect } from 'react';
import RoomLobby from '../rooms/RoomLobby';
import GameRoom from '../rooms/GameRoom';
import { useSigloSocket, disconnectSocket } from '../context/SocketContext';
import { useGameRoom } from '../hooks/useGameRoom';

const SigloMultiplayer = () => {
  const [playerId] = useState(`player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [playerName, setPlayerName] = useState('');
  const [isNameSet, setIsNameSet] = useState(false);
  const socket = useSigloSocket();

  const {
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
  } = useGameRoom(socket, playerId, playerName);

  useEffect(() => {
    document.title = 'Siglo Multijugador';
    
    // Cargar salas desde localStorage
    const loadRooms = () => {
      const savedRooms = JSON.parse(localStorage.getItem('sigloRooms') || '[]');
      socket.emit('roomsList', savedRooms);
    };

    loadRooms();
    const interval = setInterval(loadRooms, 3000);

    return () => {
      clearInterval(interval);
      // No desconectar el socket aquí, solo limpiar el interval
    };
  }, [socket]);

  // Cleanup del socket al desmontar completamente
  useEffect(() => {
    return () => {
      // Solo desconectar si el componente se desmonta completamente
      disconnectSocket();
    };
  }, []);

  if (!isNameSet) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-100 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Ingresa tu nombre</h1>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Tu nombre"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none mb-4"
            autoFocus
            onKeyPress={(e) => e.key === 'Enter' && playerName.trim() && setIsNameSet(true)}
          />
          <button
            onClick={() => playerName.trim() && setIsNameSet(true)}
            disabled={!playerName.trim()}
            className="w-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50"
          >
            Continuar
          </button>
        </div>
      </div>
    );
  }

  if (currentRoom) {
    return (
      <GameRoom
        room={currentRoom}
        playerId={playerId}
        playerName={playerName}
        isHost={isHost}
        players={players}
        pendingPlayers={pendingPlayers}
        gameState={gameState}
        betProposal={betProposal}
        myBetAccepted={myBetAccepted}
        onAcceptPlayer={acceptPlayer}
        onRejectPlayer={rejectPlayer}
        onProposeBet={proposeBet}
        onAcceptBet={acceptBet}
        onRejectBet={rejectBet}
        onStartGame={startGame}
        onDrawBall={drawBall}
        onStand={stand}
        onLeaveRoom={leaveRoom}
      />
    );
  }

  return (
    <RoomLobby
      rooms={rooms}
      onCreateRoom={createRoom}
      onJoinRoom={joinRoom}
    />
  );
};

export default SigloMultiplayer;
