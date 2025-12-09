import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faPlay, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const BettingPhase = ({ players, onPlaceBet, onStartGame, totalPot, allPlayersBet }) => {
  const [bets, setBets] = useState({});
  const [betAmount, setBetAmount] = useState('');

  const handleBetChange = (playerId, amount) => {
    setBets(prev => ({
      ...prev,
      [playerId]: amount
    }));
  };

  const handleConfirmBet = (playerId) => {
    const amount = parseFloat(bets[playerId] || 0);
    if (amount > 0) {
      onPlaceBet(playerId, amount);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-100 via-blue-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
            <FontAwesomeIcon icon={faDollarSign} className="text-5xl text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Fase de Apuestas</h1>
          <p className="text-gray-600">Cada jugador debe realizar su apuesta</p>
        </div>

        {/* Pozo Total */}
        <div className="bg-linear-to-r from-yellow-400 to-orange-500 rounded-xl p-6 mb-8 text-center shadow-lg">
          <p className="text-white text-lg font-semibold mb-2">💰 Pozo Total</p>
          <p className="text-white text-4xl font-bold">{formatCurrency(totalPot)}</p>
        </div>

        {/* Lista de jugadores y apuestas */}
        <div className="space-y-4 mb-6">
          {players.map((player) => (
            <div 
              key={player.id} 
              className={`border-2 rounded-lg p-4 transition-all ${
                player.hasBet 
                  ? 'bg-green-50 border-green-500' 
                  : 'bg-gray-50 border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    player.hasBet ? 'bg-green-500' : 'bg-gray-400'
                  }`}>
                    {player.hasBet ? (
                      <FontAwesomeIcon icon={faCheckCircle} />
                    ) : (
                      player.id
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">{player.name}</h3>
                    {player.hasBet && (
                      <p className="text-green-600 font-semibold">
                        Apuesta: {formatCurrency(player.bet)}
                      </p>
                    )}
                  </div>
                </div>

                {!player.hasBet && (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={bets[player.id] || ''}
                      onChange={(e) => handleBetChange(player.id, e.target.value)}
                      placeholder="$0"
                      min="0"
                      step="1000"
                      className="w-32 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                    />
                    <button
                      onClick={() => handleConfirmBet(player.id)}
                      disabled={!bets[player.id] || parseFloat(bets[player.id]) <= 0}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Apostar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Botón para iniciar juego */}
        <div className="space-y-3">
          {allPlayersBet ? (
            <button
              onClick={onStartGame}
              className="w-full bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              <FontAwesomeIcon icon={faPlay} className="mr-2" />
              Iniciar Juego
            </button>
          ) : (
            <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 text-center">
              <p className="text-yellow-800 font-semibold">
                ⏳ Esperando a que todos los jugadores realicen su apuesta...
              </p>
              <p className="text-yellow-700 text-sm mt-1">
                {players.filter(p => p.hasBet).length} de {players.length} jugadores han apostado
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
          <h3 className="font-bold text-blue-900 mb-2">📋 Instrucciones:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• El administrador indica el monto de la apuesta</li>
            <li>• Cada jugador ingresa su apuesta y confirma</li>
            <li>• El pozo total se muestra en tiempo real</li>
            <li>• El juego comenzará cuando todos hayan apostado</li>
            <li>• El ganador se lleva todo el pozo 💰</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BettingPhase;