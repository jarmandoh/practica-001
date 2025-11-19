import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faRedo } from '@fortawesome/free-solid-svg-icons';
import './BingoControls.css';

const BingoControls = ({ onDrawNumber, onReset, isGameActive, canDraw }) => {
  return (
    <div className="bingo-controls">
      <h3 className="bingo-controls__title">Controles</h3>
      
      <div className="bingo-controls__buttons">
        <button
          onClick={onDrawNumber}
          disabled={!canDraw}
          className={`bingo-controls__button bingo-controls__button--draw ${
            !canDraw ? 'bingo-controls__button--disabled' : ''
          }`}
        >
          <FontAwesomeIcon icon={faPlay} className="bingo-controls__icon" />
          {canDraw ? 'Sacar Número' : 'Sin números'}
        </button>

        <button
          onClick={onReset}
          className="bingo-controls__button bingo-controls__button--reset"
        >
          <FontAwesomeIcon icon={faRedo} className="bingo-controls__icon" />
          Nuevo Juego
        </button>
      </div>

      <div className="bingo-controls__status">
        <p className="bingo-controls__status-text">
          {isGameActive ? 'Juego en progreso' : 'Listo para comenzar'}
        </p>
      </div>
    </div>
  );
};

export default BingoControls;
