import React, { useState, useEffect } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { useGameManager } from '../../hooks/useGameManager';
import './BingoCard.css';

const BingoCard = ({ card, calledNumbers: initialCalledNumbers, playerName, cardNumber, gameId }) => {
  const columns = ['B', 'I', 'N', 'G', 'O'];
  const [calledNumbers, setCalledNumbers] = useState(initialCalledNumbers || []);
  const [markedNumbers, setMarkedNumbers] = useState(new Set());
  const [hasNotifiedWin, setHasNotifiedWin] = useState(false);
  const { socket } = useSocket();
  const { checkWinPattern } = useGameManager();

  // Sincronizar calledNumbers cuando cambian desde el prop
  useEffect(() => {
    if (initialCalledNumbers && initialCalledNumbers.length > 0) {
      setCalledNumbers(initialCalledNumbers);
    }
  }, [initialCalledNumbers]);

  // Verificar patrones de victoria cuando cambian los números cantados
  useEffect(() => {
    if (calledNumbers.length < 5 || hasNotifiedWin) return;

    // Obtener todos los números del cartón (excluyendo FREE)
    const cardNumbers = card.flat().filter(num => num !== 'FREE');
    
    // Verificar qué números del cartón han sido cantados
    const markedCardNumbers = cardNumbers.filter(num => calledNumbers.includes(num));
    
    // Verificar diferentes patrones de victoria
    const patterns = ['line', 'diagonal', 'fourCorners', 'letterX', 'fullCard'];
    
    for (const pattern of patterns) {
      if (checkWinPattern(markedCardNumbers, pattern)) {
        setHasNotifiedWin(true);
        
        // Emitir evento de victoria por socket
        if (socket && gameId) {
          socket.emit('bingoWin', {
            gameId,
            playerName: playerName || `Jugador ${cardNumber}`,
            cardNumber,
            pattern,
            card,
            calledNumbers: markedCardNumbers
          });
        }
        
        // Mostrar notificación al jugador
        if (window.Notification && Notification.permission === 'granted') {
          new Notification('¡BINGO!', {
            body: `¡Felicidades! Has ganado con el patrón: ${pattern}`,
            icon: '/bingo-icon.png'
          });
        }
        
        break;
      }
    }
  }, [calledNumbers, card, checkWinPattern, hasNotifiedWin, socket, gameId, playerName, cardNumber]);

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
        console.log('Número recibido por socket en BingoCard:', data);
        setCalledNumbers(data.calledNumbers || []);
        
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

      socket.on('raffleReset', (data) => {
        console.log('Sorteo reiniciado en BingoCard:', data);
        // Limpiar todos los números marcados
        setCalledNumbers([]);
        setMarkedNumbers(new Set());
        setHasNotifiedWin(false);
      });

      return () => {
        socket.off('numberDrawn');
        socket.off('raffleReset');
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
