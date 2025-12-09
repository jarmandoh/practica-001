import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHand, faForward } from '@fortawesome/free-solid-svg-icons';

const GameControls = ({ onDrawBall, onPass, currentPlayer, disabled, ballsRemaining }) => {
  return (
    <div className="bg-white rounded-xl shadow-2xl p-6">
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Turno de: <span className="text-green-600">{currentPlayer?.name}</span>
        </h3>
        <p className="text-gray-600">
          Total actual: <span className="font-bold text-lg">{currentPlayer?.total || 0}</span> / 100
        </p>
        <p className="text-gray-500 text-sm mt-1">
          Bolitas restantes: {ballsRemaining}
        </p>
      </div>

      {currentPlayer?.status === 'active' && (
        <div className="space-y-3">
          <button
            onClick={onDrawBall}
            disabled={disabled}
            className="w-full bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            <FontAwesomeIcon icon={faHand} className="mr-2" />
            Sacar Bolita
          </button>

          <button
            onClick={onPass}
            disabled={disabled || currentPlayer.balls.length === 0}
            className="w-full bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            <FontAwesomeIcon icon={faForward} className="mr-2" />
            Plantarse (Pasar Turno)
          </button>

          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3 text-center">
            <p className="text-yellow-800 font-semibold text-sm">
              ⚠️ Si tu total supera 100, quedarás eliminado
            </p>
          </div>
        </div>
      )}

      {currentPlayer?.status === 'eliminated' && (
        <div className="bg-red-100 border-2 border-red-400 rounded-lg p-4 text-center">
          <p className="text-red-700 font-bold">
            {currentPlayer.name} ha sido eliminado
          </p>
          <p className="text-red-600 text-sm">Total: {currentPlayer.total}</p>
        </div>
      )}
    </div>
  );
};

export default GameControls;
