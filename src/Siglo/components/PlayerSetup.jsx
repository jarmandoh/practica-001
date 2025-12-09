import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faPlay } from '@fortawesome/free-solid-svg-icons';

const PlayerSetup = ({ onStartGame }) => {
  const [playerNames, setPlayerNames] = useState(['', '', '']);
  const [error, setError] = useState('');

  const handleNameChange = (index, value) => {
    const newNames = [...playerNames];
    newNames[index] = value;
    setPlayerNames(newNames);
    setError('');
  };

  const addPlayer = () => {
    if (playerNames.length < 8) {
      setPlayerNames([...playerNames, '']);
    }
  };

  const removePlayer = (index) => {
    if (playerNames.length > 2) {
      const newNames = playerNames.filter((_, i) => i !== index);
      setPlayerNames(newNames);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar que todos los campos tengan nombres
    const filledNames = playerNames.filter(name => name.trim() !== '');
    
    if (filledNames.length < 2) {
      setError('Debe haber al menos 2 jugadores');
      return;
    }

    // Validar que no haya nombres duplicados
    const uniqueNames = new Set(filledNames.map(n => n.trim().toLowerCase()));
    if (uniqueNames.size !== filledNames.length) {
      setError('No puede haber nombres duplicados');
      return;
    }

    onStartGame(filledNames.map(n => n.trim()));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-100 via-pink-100 to-red-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-purple-100 rounded-full mb-4">
            <FontAwesomeIcon icon={faUsers} className="text-5xl text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Juego del Siglo</h1>
          <p className="text-gray-600">Configura los jugadores para comenzar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            {playerNames.map((name, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  placeholder={`Jugador ${index + 1}`}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                />
                {playerNames.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removePlayer(index)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {playerNames.length < 8 && (
            <button
              type="button"
              onClick={addPlayer}
              className="w-full py-2 border-2 border-dashed border-purple-300 text-purple-600 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              + Agregar Jugador
            </button>
          )}

          {error && (
            <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 space-y-2">
            <h3 className="font-bold text-blue-900">📋 Reglas del Juego:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Cada jugador saca bolitas del 1 al 99 por turnos</li>
              <li>• Solo el jugador que saca la bolita puede ver su valor</li>
              <li>• Puedes seguir sacando bolitas o plantarte</li>
              <li>• Si tu suma supera 100, quedas eliminado</li>
              <li>• Gana quien esté más cerca de 100 sin pasarse</li>
            </ul>
          </div>

          <button
            type="submit"
            className="w-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            <FontAwesomeIcon icon={faPlay} className="mr-2" />
            Iniciar Juego
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlayerSetup;
