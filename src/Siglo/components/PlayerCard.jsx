import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faSkull, faCircle, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const PlayerCard = ({ player, isCurrentPlayer, showAllTotals }) => {
  const getStatusColor = () => {
    if (player.status === 'eliminated') return 'bg-red-100 border-red-500';
    if (player.status === 'winner') return 'bg-yellow-100 border-yellow-500';
    if (isCurrentPlayer) return 'bg-green-100 border-green-500';
    return 'bg-gray-100 border-gray-300';
  };

  const getStatusIcon = () => {
    if (player.status === 'eliminated') return <FontAwesomeIcon icon={faSkull} className="text-red-600" />;
    if (player.status === 'winner') return <FontAwesomeIcon icon={faTrophy} className="text-yellow-600" />;
    if (isCurrentPlayer) return <FontAwesomeIcon icon={faCircle} className="text-green-600 animate-pulse" />;
    return null;
  };

  return (
    <div className={`border-4 rounded-xl p-4 transition-all ${getStatusColor()} ${isCurrentPlayer ? 'scale-105 shadow-lg' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-bold text-gray-800">{player.name}</h3>
        <div className="text-2xl">
          {getStatusIcon()}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Total:</span>
          {showAllTotals || isCurrentPlayer ? (
            <span className={`text-2xl font-bold ${
              player.total > 100 ? 'text-red-600' : 
              player.total >= 90 ? 'text-orange-600' : 
              'text-green-600'
            }`}>
              {player.total}
            </span>
          ) : (
            <span className="text-2xl text-gray-400">
              <FontAwesomeIcon icon={faEyeSlash} /> ???
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Bolitas:</span>
          <span className="text-lg font-semibold text-gray-700">{player.balls.length}</span>
        </div>

        {player.status === 'active' && (showAllTotals || isCurrentPlayer) && (
          <div className="mt-3 pt-3 border-t border-gray-300">
            <p className="text-xs text-gray-500 mb-1">Bolitas obtenidas:</p>
            <div className="flex flex-wrap gap-1">
              {player.balls.map((ball, index) => (
                <span 
                  key={index}
                  className="inline-block px-2 py-1 bg-blue-500 text-white rounded text-xs font-semibold"
                >
                  {ball}
                </span>
              ))}
            </div>
          </div>
        )}

        {player.status === 'active' && !showAllTotals && !isCurrentPlayer && player.balls.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-300 text-center">
            <FontAwesomeIcon icon={faEyeSlash} className="text-gray-400 text-2xl mb-1" />
            <p className="text-xs text-gray-500">Bolitas ocultas</p>
          </div>
        )}

        {player.status === 'eliminated' && (
          <div className="mt-2 text-center">
            <span className="text-red-600 font-semibold text-sm">¡Eliminado!</span>
            <p className="text-xs text-gray-500">Superó 100 puntos</p>
          </div>
        )}

        {player.status === 'winner' && (
          <div className="mt-2 text-center">
            <span className="text-yellow-600 font-bold text-lg">🎉 ¡GANADOR! 🎉</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerCard;
