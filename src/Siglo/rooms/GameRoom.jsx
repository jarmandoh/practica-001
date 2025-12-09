import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, faSignOutAlt, faDollarSign, faCheck, faTimes, 
  faPlay, faHand, faForward, faTrophy, faCrown
} from '@fortawesome/free-solid-svg-icons';

const GameRoom = ({
  room,
  playerId,
  isHost,
  players,
  pendingPlayers,
  gameState,
  betProposal,
  myBetAccepted,
  onAcceptPlayer,
  onRejectPlayer,
  onProposeBet,
  onAcceptBet,
  onRejectBet,
  onStartGame,
  onDrawBall,
  onStand,
  onLeaveRoom
}) => {
  const [betAmount, setBetAmount] = useState('');
  const [showBetModal, setShowBetModal] = useState(false);

  const me = players.find(p => p.id === playerId);
  const allBetsAccepted = players.every(p => p.betAccepted);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleProposeBet = () => {
    const amount = parseFloat(betAmount);
    if (amount > 0) {
      onProposeBet(amount);
      setBetAmount('');
      setShowBetModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-100 via-purple-100 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">{room.name}</h1>
              <p className="text-gray-600">
                {isHost && <><FontAwesomeIcon icon={faCrown} className="text-yellow-500 mr-2" />Eres el anfitrión</>}
                {!isHost && <>Anfitrión: {room.hostName}</>}
              </p>
            </div>
            <button
              onClick={onLeaveRoom}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
              Salir
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Panel izquierdo - Controles */}
          <div className="lg:col-span-1 space-y-6">
            {/* Solicitudes pendientes (solo host) */}
            {isHost && pendingPlayers.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Solicitudes de ingreso ({pendingPlayers.length})
                </h3>
                <div className="space-y-3">
                  {pendingPlayers.map((request) => (
                    <div key={request.playerId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-800">{request.playerName}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onAcceptPlayer(request.playerId)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors"
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                        <button
                          onClick={() => onRejectPlayer(request.playerId)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Controles del host - Lobby */}
            {isHost && gameState === 'lobby' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Panel del Anfitrión</h3>
                <button
                  onClick={() => setShowBetModal(true)}
                  disabled={players.length < 2}
                  className="w-full bg-linear-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                >
                  <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                  Proponer Apuesta
                </button>
                {players.length < 2 && (
                  <p className="text-sm text-gray-500 text-center">Se necesitan al menos 2 jugadores</p>
                )}
              </div>
            )}

            {/* Propuesta de apuesta */}
            {gameState === 'betting' && betProposal && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Propuesta de Apuesta</h3>
                <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 mb-4">
                  <p className="text-yellow-900 font-bold text-2xl text-center">
                    {formatCurrency(betProposal.betAmount)}
                  </p>
                </div>
                
                {!myBetAccepted && !isHost && (
                  <div className="flex gap-3">
                    <button
                      onClick={onAcceptBet}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                      <FontAwesomeIcon icon={faCheck} className="mr-2" />
                      Aceptar
                    </button>
                    <button
                      onClick={onRejectBet}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                      <FontAwesomeIcon icon={faTimes} className="mr-2" />
                      Rechazar
                    </button>
                  </div>
                )}

                {myBetAccepted && (
                  <div className="bg-green-100 border-2 border-green-400 rounded-lg p-3 text-center">
                    <p className="text-green-800 font-semibold">✓ Has aceptado la apuesta</p>
                  </div>
                )}

                {isHost && allBetsAccepted && (
                  <button
                    onClick={onStartGame}
                    className="w-full bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-all mt-3"
                  >
                    <FontAwesomeIcon icon={faPlay} className="mr-2" />
                    Iniciar Juego
                  </button>
                )}
              </div>
            )}

            {/* Controles del juego */}
            {gameState === 'playing' && me && me.status === 'active' && room.currentTurn === playerId && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Tu Turno</h3>
                <div className="space-y-3">
                  <button
                    onClick={onDrawBall}
                    className="w-full bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-all"
                  >
                    <FontAwesomeIcon icon={faHand} className="mr-2" />
                    Sacar Bolita
                  </button>
                  <button
                    onClick={onStand}
                    disabled={me.balls.length === 0}
                    className="w-full bg-linear-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 px-4 rounded-lg transition-all disabled:opacity-50"
                  >
                    <FontAwesomeIcon icon={faForward} className="mr-2" />
                    Plantarse
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Panel derecho - Jugadores */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                <FontAwesomeIcon icon={faUsers} className="mr-2" />
                Jugadores ({players.length})
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className={`border-2 rounded-lg p-4 ${
                      player.id === playerId ? 'bg-blue-50 border-blue-500' :
                      player.status === 'eliminated' ? 'bg-red-50 border-red-300' :
                      player.status === 'winner' ? 'bg-yellow-50 border-yellow-500' :
                      'bg-gray-50 border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-800">
                        {player.name}
                        {player.isHost && <FontAwesomeIcon icon={faCrown} className="text-yellow-500 ml-2" />}
                        {player.id === playerId && <span className="text-blue-600 text-sm ml-2">(Tú)</span>}
                      </h4>
                      {player.status === 'winner' && (
                        <FontAwesomeIcon icon={faTrophy} className="text-yellow-500 text-xl" />
                      )}
                    </div>

                    {gameState === 'betting' && betProposal && (
                      <div className="mb-2">
                        {player.betAccepted ? (
                          <span className="text-green-600 text-sm">✓ Apuesta aceptada</span>
                        ) : (
                          <span className="text-gray-500 text-sm">⏳ Esperando respuesta...</span>
                        )}
                      </div>
                    )}

                    {gameState === 'playing' && (
                      <>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">Puntaje:</span>
                          <span className={`font-bold text-lg ${
                            player.id === playerId 
                              ? player.score > 100 ? 'text-red-600' : 'text-green-600'
                              : 'text-gray-400'
                          }`}>
                            {player.id === playerId ? player.score : '???'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm">Bolitas:</span>
                          <span className="text-gray-700 font-semibold">{player.balls.length}</span>
                        </div>
                        {player.status === 'eliminated' && (
                          <div className="mt-2 text-center text-red-600 font-semibold text-sm">
                            ❌ Eliminado
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal de proponer apuesta */}
        {showBetModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Proponer Apuesta</h2>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder="Monto de la apuesta"
                min="0"
                step="1000"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none mb-4"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowBetModal(false);
                    setBetAmount('');
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleProposeBet}
                  disabled={!betAmount || parseFloat(betAmount) <= 0}
                  className="flex-1 bg-linear-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-all disabled:opacity-50"
                >
                  Proponer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameRoom;
