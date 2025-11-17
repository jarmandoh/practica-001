import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faRedo } from '@fortawesome/free-solid-svg-icons';

const BingoControls = ({ onDrawNumber, onReset, isGameActive, canDraw }) => {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 mt-6 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">Controles</h3>
      
      <div className="space-y-4">
        <button
          onClick={onDrawNumber}
          disabled={!canDraw}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${
            canDraw
              ? 'bg-yellow-200 hover:bg-yellow-300 text-yellow-900 shadow-lg hover:shadow-xl transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <FontAwesomeIcon icon={faPlay} className="mr-2" />
          {canDraw ? 'Sacar Número' : 'Sin números'}
        </button>

        <button
          onClick={onReset}
          className="w-full py-3 px-6 rounded-lg font-semibold bg-red-200 hover:bg-red-300 text-red-800 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <FontAwesomeIcon icon={faRedo} className="mr-2" />
          Nuevo Juego
        </button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          {isGameActive ? 'Juego en progreso' : 'Listo para comenzar'}
        </p>
      </div>
    </div>
  );
};

export default BingoControls;