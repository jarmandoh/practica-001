import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faEye, 
  faEyeSlash,
  faListOl,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { useGestorAuth } from '../hooks/useGestorAuth';
import { useGameManager } from '../hooks/useGameManager';

const GestorLogin = () => {
  const { loginGestor } = useGestorAuth();
  const { games } = useGameManager();
  const [formData, setFormData] = useState({
    gameId: '',
    password: '',
    gestorName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Limpiar error al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.gameId) {
        throw new Error('Selecciona un juego');
      }
      if (!formData.password.trim()) {
        throw new Error('Ingresa la contraseña');
      }
      if (!formData.gestorName.trim()) {
        throw new Error('Ingresa tu nombre');
      }

      await loginGestor(formData.gameId, formData.password.trim(), formData.gestorName.trim());
      // La redirección se manejará por el componente padre
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar solo juegos activos que tengan contraseña de gestor
  const availableGames = games.filter(game => 
    game.status === 'active' && game.gestorPassword
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-600 to-red-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faListOl} className="text-3xl text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestor de Sorteos</h1>
          <p className="text-gray-600">
            Accede para gestionar tu sorteo asignado
          </p>
        </div>

        {/* Mensaje de juegos disponibles */}
        {availableGames.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-600 mr-2" />
              <span className="text-sm text-yellow-800">
                No hay juegos activos con gestor habilitado
              </span>
            </div>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selector de Juego */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Juego Asignado
            </label>
            <select
              name="gameId"
              value={formData.gameId}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              disabled={availableGames.length === 0}
            >
              <option value="">Selecciona el juego</option>
              {availableGames.map(game => (
                <option key={game.id} value={game.id}>
                  {game.name} (ID: {game.id})
                </option>
              ))}
            </select>
          </div>

          {/* Nombre del Gestor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tu Nombre
            </label>
            <input
              type="text"
              name="gestorName"
              value={formData.gestorName}
              onChange={handleInputChange}
              placeholder="Nombre del gestor"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña del Sorteo
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Contraseña proporcionada por el admin"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Botones */}
          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading || availableGames.length === 0}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white py-3 px-6 rounded-lg transition-colors font-semibold"
            >
              {loading ? 'Verificando...' : 'Acceder al Sorteo'}
            </button>

            <Link
              to="/bingo"
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg transition-colors font-semibold text-center block"
            >
              <FontAwesomeIcon icon={faHome} className="mr-2" />
              Volver al Inicio
            </Link>
          </div>
        </form>

        {/* Info adicional */}
        <div className="mt-8 p-4 bg-orange-50 rounded-lg">
          <h4 className="font-semibold text-orange-800 mb-2">Como Gestor puedes:</h4>
          <ul className="text-sm text-orange-700 space-y-1">
            <li>• Cantar números del sorteo</li>
            <li>• Controlar el flujo del juego</li>
            <li>• Ver cartones participantes</li>
            <li>• Marcar ganadores</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GestorLogin;