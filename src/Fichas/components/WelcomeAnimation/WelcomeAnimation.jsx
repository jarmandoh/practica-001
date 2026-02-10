import React, { useState, useEffect } from 'react';
import './WelcomeAnimation.css';

const WelcomeAnimation = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState('enter');

  useEffect(() => {
    // Fase de entrada (0-2s)
    const enterTimer = setTimeout(() => {
      setAnimationPhase('speaking');
    }, 500);

    // Fase de habla (2-4s)
    const speakTimer = setTimeout(() => {
      setAnimationPhase('exit');
    }, 3500);

    // Fase de salida (4-5s)
    const exitTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, 4500);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(speakTimer);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`welcome-animation-overlay ${animationPhase}`}>
      <div className="welcome-content">
        {/* Personaje femenino animado */}
        <div className="character-container">
          <div className="character">
            {/* Cabeza */}
            <div className="head">
              <div className="hair"></div>
              <div className="face">
                <div className="eyes">
                  <div className="eye left"></div>
                  <div className="eye right"></div>
                </div>
                <div className="nose"></div>
                <div className="mouth"></div>
              </div>
            </div>
            
            {/* Cuerpo */}
            <div className="body">
              <div className="dress"></div>
              <div className="arm left">
                <div className="hand"></div>
              </div>
              <div className="arm right">
                <div className="hand"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje de bienvenida */}
        <div className="welcome-message">
          <div className="speech-bubble">
            <h2>¡Bienvenido!</h2>
            <p>¡Al emocionante juego de Fichas a 100!</p>
            <div className="sparkles">
              <span className="sparkle">✨</span>
              <span className="sparkle">✨</span>
              <span className="sparkle">✨</span>
            </div>
          </div>
        </div>

        {/* Elementos decorativos */}
        <div className="decorative-elements">
          <div className="chip chip-1">🎲</div>
          <div className="chip chip-2">🎲</div>
          <div className="chip chip-3">🎯</div>
          <div className="chip chip-4">🎯</div>
          <div className="chip chip-5">💯</div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeAnimation;
