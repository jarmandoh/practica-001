import { useState, useCallback, useEffect } from 'react';
import { useSocket } from './useSocket';
import bingoCardsData from '../data/bingoCards.json';

export const useBingo = (gameId = null, initialCalledNumbers = []) => {
  const [calledNumbers, setCalledNumbers] = useState(initialCalledNumbers);
  const [currentNumber, setCurrentNumber] = useState(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [bingoCard, setBingoCard] = useState(() => generateBingoCard());
  const [winnerCards, setWinnerCards] = useState([]);
  const { socket } = useSocket();

  // Sincronizar calledNumbers con el prop inicial
  useEffect(() => {
    if (initialCalledNumbers && initialCalledNumbers.length > 0) {
      setCalledNumbers(initialCalledNumbers);
    }
  }, [initialCalledNumbers]);

  // Generar cartón de Bingo
  function generateBingoCard() {
    const card = [];
    const ranges = [
      [1, 15],   // B
      [16, 30],  // I
      [31, 45],  // N
      [46, 60],  // G
      [61, 75]   // O
    ];

    for (let row = 0; row < 5; row++) {
      const cardRow = [];
      for (let col = 0; col < 5; col++) {
        if (row === 2 && col === 2) {
          // Centro libre
          cardRow.push('FREE');
        } else {
          const [min, max] = ranges[col];
          let num;
          do {
            num = Math.floor(Math.random() * (max - min + 1)) + min;
          } while (cardRow.includes(num));
          cardRow.push(num);
        }
      }
      card.push(cardRow);
    }
    return card;
  }

  // Verificar si un cartón es ganador
  const checkBingo = useCallback((card) => {
    // Verificar filas
    for (let row = 0; row < 5; row++) {
      if (card[row].every(cell => cell === 'FREE' || calledNumbers.includes(cell))) {
        return { type: 'row', position: row };
      }
    }

    // Verificar columnas
    for (let col = 0; col < 5; col++) {
      if (card.every(row => row[col] === 'FREE' || calledNumbers.includes(row[col]))) {
        return { type: 'column', position: col };
      }
    }

    // Verificar diagonal principal (top-left to bottom-right)
    if (card.every((row, i) => row[i] === 'FREE' || calledNumbers.includes(row[i]))) {
      return { type: 'diagonal', position: 'main' };
    }

    // Verificar diagonal secundaria (top-right to bottom-left)
    if (card.every((row, i) => row[4 - i] === 'FREE' || calledNumbers.includes(row[4 - i]))) {
      return { type: 'diagonal', position: 'anti' };
    }

    return null;
  }, [calledNumbers]);

  // Buscar todos los cartones ganadores
  const findWinnerCards = useCallback(() => {
    if (calledNumbers.length < 4) return []; // Mínimo 4 números para ganar

    const winners = [];
    bingoCardsData.forEach(cardData => {
      const winPattern = checkBingo(cardData.card);
      if (winPattern) {
        winners.push({
          ...cardData,
          winPattern
        });
      }
    });

    return winners;
  }, [calledNumbers, checkBingo]);

  // Obtener siguiente número disponible
  const getNextNumber = useCallback(() => {
    const allNumbers = Array.from({ length: 75 }, (_, i) => i + 1);
    const remainingNumbers = allNumbers.filter(num => !calledNumbers.includes(num));
    
    if (remainingNumbers.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * remainingNumbers.length);
    return remainingNumbers[randomIndex];
  }, [calledNumbers]);

  // Sacar número sin animación
  const drawNumber = useCallback((raffleNumber = 1) => {
    const nextNum = getNextNumber();
    if (nextNum) {
      setCurrentNumber(nextNum);
      setCalledNumbers(prev => {
        const newCalledNumbers = [...prev, nextNum];
        
        // Emitir evento por socket con los números actualizados
        // El evento se emite inmediatamente para iniciar la animación
        if (socket) {
          socket.emit('numberDrawn', {
            number: nextNum,
            calledNumbers: newCalledNumbers,
            raffleNumber: raffleNumber,
            timestamp: Date.now()
          });
        }
        
        return newCalledNumbers;
      });
      setIsGameActive(true);
    }
  }, [getNextNumber, socket]);

  // Actualizar ganadores cuando cambien los números cantados
  useEffect(() => {
    const winners = findWinnerCards();
    setWinnerCards(winners);
  }, [calledNumbers, findWinnerCards]);

  // Reiniciar juego
  const resetGame = useCallback(() => {
    setCalledNumbers([]);
    setCurrentNumber(null);
    setIsGameActive(false);
    setBingoCard(generateBingoCard());
    setWinnerCards([]);
  }, []);

  // Escuchar eventos de socket
  useEffect(() => {
    if (socket) {
      socket.on('numberDrawn', (data) => {
        setCurrentNumber(data.number);
        setCalledNumbers(data.calledNumbers || []);
        setIsGameActive(true);
      });

      socket.on('raffleReset', (data) => {
        console.log('Sorteo reiniciado en useBingo:', data);
        setCurrentNumber(null);
        setCalledNumbers([]);
        setIsGameActive(false);
        setWinnerCards([]);
      });

      return () => {
        socket.off('numberDrawn');
        socket.off('raffleReset');
      };
    }
  }, [socket]);

  return {
    calledNumbers,
    currentNumber,
    isGameActive,
    bingoCard,
    winnerCards,
    drawNumber,
    resetGame,
    getNextNumber
  };
};