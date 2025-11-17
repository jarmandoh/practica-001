import React, { useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';

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
    <div className="bg-white rounded-xl shadow-2xl p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">CARTÓN DE BINGO</h2>
      
      <div className="grid grid-cols-5 gap-2 mb-4">
        {columns.map((letter) => (
          <div
            key={letter}
            className="bg-purple-300 text-purple-900 text-2xl font-bold py-3 text-center rounded-lg"
          >
            {letter}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-2">
        {card.map((row, rowIndex) =>
          row.map((num, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              data-number={num}
              onClick={() => toggleNumber(num)}
              className={`aspect-square flex items-center justify-center text-xl font-semibold rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                num === 'FREE'
                  ? 'bg-yellow-200 text-yellow-900 border-yellow-400'
                  : checkNumber(num)
                  ? 'bg-green-300 text-green-900 border-green-400 transform scale-105 shadow-lg'
                  : 'bg-gray-50 text-gray-800 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
              }`}
            >
              {num === 'FREE' ? '★' : num}
            </div>
          ))
        )}
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>Números marcados: {markedNumbers.size + calledNumbers.filter(num => card.flat().includes(num)).length}</p>
        <p className="text-xs mt-1">Haz clic en los números para marcarlos manualmente</p>
      </div>
    </div>
  );
};

export default BingoCard;