import React, { useState, useEffect, useRef } from 'react';
import './NumberDisplay.css';

const NumberDisplay = ({ currentNumber, calledNumbers }) => {
  const [animatingNumber, setAnimatingNumber] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const previousNumberRef = useRef(null);

  const getColumnLetter = (num) => {
    if (num >= 1 && num <= 15) return 'B';
    if (num >= 16 && num <= 30) return 'I';
    if (num >= 31 && num <= 45) return 'N';
    if (num >= 46 && num <= 60) return 'G';
    if (num >= 61 && num <= 75) return 'O';
    return '';
  };

  // Efecto para detectar cuando se saca un nuevo número
  useEffect(() => {
    if (currentNumber && currentNumber !== previousNumberRef.current) {
      // Nuevo número sacado, iniciar animación
      setIsAnimating(true);
      
      const animationDuration = 3000; // 5 segundos
      const intervalTime = 200; // Cambiar número cada 100ms
      const totalSteps = animationDuration / intervalTime;
      let currentStep = 0;

      const animationInterval = setInterval(() => {
        if (currentStep < totalSteps - 1) {
          // Generar número aleatorio entre 1 y 75
          const randomNum = Math.floor(Math.random() * 75) + 1;
          setAnimatingNumber(randomNum);
          currentStep++;
        } else {
          // Última iteración: mostrar el número real
          clearInterval(animationInterval);
          setAnimatingNumber(currentNumber);
          
          // Después de 500ms, terminar la animación
          setTimeout(() => {
            setIsAnimating(false);
            setAnimatingNumber(null);
          }, 500);
        }
      }, intervalTime);

      // Actualizar la referencia del número anterior
      previousNumberRef.current = currentNumber;

      return () => clearInterval(animationInterval);
    }
  }, [currentNumber]);

  // Determinar qué número mostrar
  const displayNumber = isAnimating ? animatingNumber : currentNumber;

  return (
    <div className="number-display">
      <h2 className="number-display__title">Número Actual</h2>
      
      <div className="number-display__content">
        {displayNumber ? (
          <div className="number-display__current">
            <div className="number-display__label">
              {getColumnLetter(displayNumber)}-{displayNumber}
            </div>
            <div className={`number-display__ball ${isAnimating ? 'number-display__ball--animating' : ''}`}>
              <span className="number-display__ball-number">
                {displayNumber}
              </span>
            </div>
          </div>
        ) : (
          <div className="number-display__waiting">
            <div className="number-display__emoji">🎱</div>
            <p className="number-display__hint">Presiona "Sacar Número"</p>
          </div>
        )}
      </div>

      <div className="number-display__footer">
        <p className="number-display__stats">
          Cantados: <span className="number-display__stats-value">{calledNumbers.length}</span>/75
        </p>
        <div className="number-display__progress">
          <div
            className="number-display__progress-bar"
            style={{ width: `${(calledNumbers.length / 75) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default NumberDisplay;
