import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faChevronLeft, faChevronRight, faTrophy, faStar } from '@fortawesome/free-solid-svg-icons';
import './WinnerModal.css';

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
    <div className="winner-modal">
      <div className="winner-modal__container">
        {/* Header */}
        <div className="winner-modal__header">
          <div className="winner-modal__header-content">
            <div className="winner-modal__title-wrapper">
              <FontAwesomeIcon icon={faTrophy} className="winner-modal__trophy-icon" />
              <div>
                <h2 className="winner-modal__title">¡BINGO!</h2>
                <p className="winner-modal__subtitle">
                  {winnerCards.length === 1 
                    ? 'Cartón Ganador' 
                    : `${winnerCards.length} Cartones Ganadores`
                  }
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="winner-modal__close-button"
            >
              <FontAwesomeIcon icon={faTimes} className="winner-modal__close-icon" />
            </button>
          </div>

          {/* Navegación entre ganadores */}
          {winnerCards.length > 1 && (
            <div className="winner-modal__navigation">
              <button
                onClick={prevWinner}
                className="winner-modal__nav-button"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <span className="winner-modal__nav-text">
                Cartón {currentWinnerIndex + 1} de {winnerCards.length}
              </span>
              <button
                onClick={nextWinner}
                className="winner-modal__nav-button"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          )}
        </div>

        {/* Contenido del cartón ganador */}
        <div className="winner-modal__content">
          {/* Info del cartón */}
          <div className="winner-modal__card-info">
            <div className="winner-modal__card-title">
              <FontAwesomeIcon icon={faStar} className="winner-modal__star-icon" />
              <h3 className="winner-modal__card-number">
                Cartón #{currentWinner.id}
              </h3>
              <FontAwesomeIcon icon={faStar} className="winner-modal__star-icon" />
            </div>
            <p className="winner-modal__pattern">
              Patrón Ganador: {getPatternDescription(currentWinner.winPattern)}
            </p>
          </div>

          {/* Cartón de Bingo */}
          <div className="winner-modal__bingo-card">
            {/* Headers de columnas */}
            <div className="winner-modal__columns">
              {['B', 'I', 'N', 'G', 'O'].map((letter, index) => (
                <div
                  key={letter}
                  className={`winner-modal__column-header ${
                    currentWinner.winPattern.type === 'column' && currentWinner.winPattern.position === index
                      ? 'winner-modal__column-header--winning'
                      : ''
                  }`}
                >
                  {letter}
                </div>
              ))}
            </div>

            {/* Grid del cartón */}
            <div className="winner-modal__grid">
              {currentWinner.card.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                  const isWinning = isWinningCell(rowIndex, colIndex, currentWinner.winPattern);
                  const isFree = cell === 'FREE';
                  
                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`winner-modal__cell ${
                        isWinning 
                          ? 'winner-modal__cell--winning' 
                          : isFree 
                            ? 'winner-modal__cell--free' 
                            : 'winner-modal__cell--normal'
                      }`}
                    >
                      {isFree ? '★' : cell}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="winner-modal__actions">
            {winnerCards.length > 1 && (
              <>
                <button
                  onClick={prevWinner}
                  className="winner-modal__action-button winner-modal__action-button--secondary"
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="winner-modal__action-icon" />
                  Anterior
                </button>
                <button
                  onClick={nextWinner}
                  className="winner-modal__action-button winner-modal__action-button--secondary"
                >
                  Siguiente
                  <FontAwesomeIcon icon={faChevronRight} className="winner-modal__action-icon-right" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="winner-modal__action-button winner-modal__action-button--primary"
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
