import React from 'react';

const NumberDisplay = ({ currentNumber, calledNumbers }) => {
  const getColumnLetter = (num) => {
    if (num >= 1 && num <= 15) return 'B';
    if (num >= 16 && num <= 30) return 'I';
    if (num >= 31 && num <= 45) return 'N';
    if (num >= 46 && num <= 60) return 'G';
    if (num >= 61 && num <= 75) return 'O';
    return '';
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-4 text-center max-w-80">
      <h2 className="text-lg font-bold text-gray-800 mb-3">Número Actual</h2>
      
      <div className="mb-4">
        {currentNumber ? (
          <div className="space-y-3">
            <div className="text-4xl font-bold text-purple-700">
              {getColumnLetter(currentNumber)}-{currentNumber}
            </div>
            <div className="w-32 h-32 bg-yellow-200 rounded-full flex items-center justify-center mx-auto shadow-lg border-4 border-yellow-300">
              <span className="text-4xl font-bold text-gray-800">
                {currentNumber}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-3xl text-gray-400">🎱</div>
            <p className="text-xs text-gray-500">Presiona "Sacar Número"</p>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-600 mb-2">
          Cantados: <span className="font-semibold">{calledNumbers.length}</span>/75
        </p>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-purple-300 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${(calledNumbers.length / 75) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default NumberDisplay;