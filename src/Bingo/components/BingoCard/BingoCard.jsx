import React, { useState, useEffect } from 'react';
import { useSocket } from '../../hooks/useSocket';
import './BingoCard.css';

const BingoCard = ({ card, calledNumbers: initialCalledNumbers }) => {
  const columns = ['B', 'I', 'N', 'G', 'O'];
  const [calledNumbers, setCalledNumbers] = useState(initialCalledNumbers || []);
  const [markedNumbers, setMarkedNumbers] = useState(new Set());
  const { socket } = useSocket();

  const checkNumber = (num) => {
    return calledNumbers.includes(num) || markedNumbers.has(num);
  };

  const toggleNumber = (num) => {
    if (num === 'FREE') return;
    
    setMarkedNumbers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(num)) {
        newSet.delete(num);
      } else {
        newSet.add(num);
      }
      return newSet;
    });
  };

  // Escuchar eventos de socket para marcar números automáticamente
  useEffect(() => {
    if (socket) {
      socket.on('numberDrawn', (data) => {
        setCalledNumbers(data.calledNumbers);
        
        // Marcar automáticamente el número en el cartón si está presente
        const newNumber = data.number;
        const cardFlat = card.flat();
        if (cardFlat.includes(newNumber)) {
          setMarkedNumbers(prev => new Set([...prev, newNumber]));
          
          // Efecto visual de marcado
          setTimeout(() => {
            const element = document.querySelector(`[data-number="${newNumber}"]`);
            if (element) {
              element.classList.add('animate-pulse');
              setTimeout(() => {
                element.classList.remove('animate-pulse');
              }, 1000);
            }
          }, 100);
        }
      });

      return () => {
        socket.off('numberDrawn');
      };
    }
  }, [socket, card]);

  return (
    <div className="bingo-card">
      <h2 className="bingo-card__title">CARTÓN DE BINGO</h2>
      
      <div className="bingo-card__header">
        {columns.map((letter) => (
          <div key={letter} className="bingo-card__column-label">
            {letter}
          </div>
        ))}
      </div>

      <div className="bingo-card__grid">
        {card.map((row, rowIndex) =>
          row.map((num, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              data-number={num}
              onClick={() => toggleNumber(num)}
              className={`bingo-card__cell ${
                num === 'FREE'
                  ? 'bingo-card__cell--free'
                  : checkNumber(num)
                  ? 'bingo-card__cell--marked'
                  : 'bingo-card__cell--normal'
              }`}
            >
              {num === 'FREE' ? '★' : num}
            </div>
          ))
        )}
      </div>
      
      <div className="bingo-card__footer">
        <p>Números marcados: {markedNumbers.size + calledNumbers.filter(num => card.flat().includes(num)).length}</p>
        <p className="bingo-card__hint">Haz clic en los números para marcarlos manualmente</p>
      </div>
    </div>
  );
};

export default BingoCard;
