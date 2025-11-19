import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faChevronLeft, faChevronRight, faTrophy, faStar } from '@fortawesome/free-solid-svg-icons';

const WinnerModal = ({ winnerCards, onClose }) => {
  const [currentWinnerIndex, setCurrentWinnerIndex] = useState(0);

  if (!winnerCards || winnerCards.length === 0) return null;

  const currentWinner = winnerCards[currentWinnerIndex];

  const getPatternDescription = (pattern) => {
    switch (pattern.type) {
      case 'row':
        return `Fila ${pattern.position + 1}`;
      case 'column': {
        const columns = ['B', 'I', 'N', 'G', 'O'];
        return `Columna ${columns[pattern.position]}`;
      }
      case 'diagonal':
        return pattern.position === 'main' ? 'Diagonal Principal' : 'Diagonal Secundaria';
      default:
        return 'Patrón Ganador';
    }
  };

  const isWinningCell = (rowIndex, colIndex, pattern) => {
    switch (pattern.type) {
      case 'row':
        return rowIndex === pattern.position;
      case 'column':
        return colIndex === pattern.position;
      case 'diagonal':
        if (pattern.position === 'main') {
          return rowIndex === colIndex;
        } else {
          return rowIndex === (4 - colIndex);
        }
      default:
        return false;
    }
  };

  const nextWinner = () => {
    setCurrentWinnerIndex((prev) => (prev + 1) % winnerCards.length);
  };

  const prevWinner = () => {
    setCurrentWinnerIndex((prev) => (prev - 1 + winnerCards.length) % winnerCards.length);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-linear-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faTrophy} className="text-2xl" />
              <div>
                <h2 className="text-2xl font-bold">¡BINGO!</h2>
                <p className="text-yellow-100">
                  {winnerCards.length === 1 
                    ? 'Cartón Ganador' 
                    : `${winnerCards.length} Cartones Ganadores`
                  }
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-yellow-200 transition-colors p-2"
            >
              <FontAwesomeIcon icon={faTimes} className="text-xl" />
            </button>
          </div>

          {/* Navegación entre ganadores */}
          {winnerCards.length > 1 && (
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-yellow-300">
              <button
                onClick={prevWinner}
                className="bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-colors"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <span className="text-center">
                Cartón {currentWinnerIndex + 1} de {winnerCards.length}
              </span>
              <button
                onClick={nextWinner}
                className="bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-colors"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          )}
        </div>

        {/* Contenido del cartón ganador */}
        <div className="p-6">
          {/* Info del cartón */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
              <h3 className="text-xl font-bold text-gray-800">
                Cartón #{currentWinner.id}
              </h3>
              <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
            </div>
            <p className="text-purple-600 font-semibold">
              Patrón Ganador: {getPatternDescription(currentWinner.winPattern)}
            </p>
          </div>

          {/* Cartón de Bingo */}
          <div className="bg-linear-to-br from-purple-50 to-blue-50 rounded-xl p-4 shadow-inner">
            {/* Headers de columnas */}
            <div className="grid grid-cols-5 gap-2 mb-3">
              {['B', 'I', 'N', 'G', 'O'].map((letter, index) => (
                <div
                  key={letter}
                  className={`text-center font-bold text-white p-3 rounded-lg ${
                    currentWinner.winPattern.type === 'column' && currentWinner.winPattern.position === index
                      ? 'bg-yellow-500 animate-pulse'
                      : 'bg-purple-600'
                  }`}
                >
                  {letter}
                </div>
              ))}
            </div>

            {/* Grid del cartón */}
            <div className="grid grid-cols-5 gap-2">
              {currentWinner.card.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                  const isWinning = isWinningCell(rowIndex, colIndex, currentWinner.winPattern);
                  const isFree = cell === 'FREE';
                  
                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`
                        h-12 flex items-center justify-center rounded-lg font-bold text-sm transition-all duration-300
                        ${isWinning 
                          ? 'bg-yellow-400 text-black shadow-lg ring-2 ring-yellow-500 animate-pulse transform scale-105' 
                          : isFree 
                            ? 'bg-green-500 text-white' 
                            : 'bg-white text-gray-800 border-2 border-gray-200'
                        }
                      `}
                    >
                      {isFree ? '★' : cell}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-center space-x-4 mt-6">
            {winnerCards.length > 1 && (
              <>
                <button
                  onClick={prevWinner}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
                  Anterior
                </button>
                <button
                  onClick={nextWinner}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Siguiente
                  <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-lg transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinnerModal;