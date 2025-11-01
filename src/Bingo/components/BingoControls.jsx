import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faRedo } from '@fortawesome/free-solid-svg-icons';

const BingoControls = ({ onDrawNumber, onReset, isGameActive, canDraw }) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mt-6">
      <h3 className="text-xl font-semibold text-white mb-4 text-center">Controles</h3>
      
      <div className="space-y-4">
        <button
          onClick={onDrawNumber}
          disabled={!canDraw}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${
            canDraw
              ? 'bg-yellow-500 hover:bg-yellow-600 text-black shadow-lg hover:shadow-xl transform hover:scale-105'
              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
          }`}
        >
          <FontAwesomeIcon icon={faPlay} className="mr-2" />
          {canDraw ? 'Sacar Número' : 'Sin números'}
        </button>

        <button
          onClick={onReset}
          className="w-full py-3 px-6 rounded-lg font-semibold bg-red-500 hover:bg-red-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <FontAwesomeIcon icon={faRedo} className="mr-2" />
          Nuevo Juego
        </button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-purple-100 text-sm">
          {isGameActive ? 'Juego en progreso' : 'Listo para comenzar'}
        </p>
      </div>
    </div>
  );
};

export default BingoControls;