import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faDoorOpen, faUsers } from '@fortawesome/free-solid-svg-icons';

const RoomLobby = ({ rooms, onCreateRoom, onJoinRoom }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomName, setRoomName] = useState('');

  const handleCreate = () => {
    if (roomName.trim()) {
      onCreateRoom(roomName.trim());
      setRoomName('');
      setShowCreateModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">🎮 Salas de Juego - Siglo</h1>
              <p className="text-gray-600">Crea o únete a una sala para jugar</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-linear-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Crear Sala
            </button>
          </div>
        </div>

        {/* Lista de salas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl shadow-lg p-12 text-center">
              <FontAwesomeIcon icon={faDoorOpen} className="text-6xl text-gray-300 mb-4" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No hay salas disponibles</h3>
              <p className="text-gray-500 mb-6">Sé el primero en crear una sala</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Crear Primera Sala
              </button>
            </div>
          ) : (
            rooms.map((room) => (
              <div key={room.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{room.name}</h3>
                    <p className="text-sm text-gray-500">Host: {room.hostName}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    room.status === 'waiting' ? 'bg-green-100 text-green-800' :
                    room.status === 'playing' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {room.status === 'waiting' ? 'Esperando' : 
                     room.status === 'playing' ? 'En juego' : 'Finalizado'}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      <FontAwesomeIcon icon={faUsers} className="mr-2" />
                      Jugadores
                    </span>
                    <span className="font-semibold text-gray-800">
                      {room.players.length}/{room.maxPlayers}
                    </span>
                  </div>
                </div>

                {room.status === 'waiting' && room.players.length < room.maxPlayers && (
                  <button
                    onClick={() => onJoinRoom(room.id)}
                    className="w-full bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
                  >
                    <FontAwesomeIcon icon={faDoorOpen} className="mr-2" />
                    Unirse
                  </button>
                )}

                {room.status === 'waiting' && room.players.length >= room.maxPlayers && (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded-lg cursor-not-allowed"
                  >
                    Sala llena
                  </button>
                )}

                {room.status !== 'waiting' && (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded-lg cursor-not-allowed"
                  >
                    En progreso
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Modal crear sala */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Crear Nueva Sala</h2>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Nombre de la sala"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none mb-6"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setRoomName('');
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!roomName.trim()}
                  className="flex-1 bg-linear-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Crear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomLobby;
