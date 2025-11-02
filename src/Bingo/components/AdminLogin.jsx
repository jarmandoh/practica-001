import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLock, 
  faEye, 
  faEyeSlash, 
  faHome, 
  faShieldAlt,
  faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError('Por favor, ingresa la contraseña');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simular un pequeño delay para mejor UX
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = onLogin(password);
    
    if (success) {
      setPassword('');
      setAttempts(0);
    } else {
      setAttempts(prev => prev + 1);
      setError('Contraseña incorrecta. Inténtalo de nuevo.');
      setPassword('');
      
      // Bloquear temporalmente después de 3 intentos fallidos
      if (attempts >= 2) {
        setError('Demasiados intentos fallidos. Espera 30 segundos.');
        setTimeout(() => {
          setAttempts(0);
          setError('');
        }, 30000);
      }
    }
    
    setIsLoading(false);
  };

  const isBlocked = attempts >= 3;

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header con navegación */}
        <div className="text-center mb-8">
          <Link 
            to="/bingo" 
            className="inline-flex items-center text-white hover:text-purple-200 transition-colors mb-6"
          >
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            ← Volver al Juego
          </Link>
        </div>

        {/* Tarjeta de login */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-purple-700 to-purple-900 text-white p-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faShieldAlt} className="text-2xl" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Administrador de Bingo</h1>
            <p className="text-purple-200">Acceso Restringido</p>
          </div>

          {/* Formulario */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo de contraseña */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                  <FontAwesomeIcon icon={faLock} className="mr-2 text-purple-600" />
                  Contraseña de Administrador
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isBlocked || isLoading}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-purple-300 focus:outline-none transition-colors ${
                      error ? 'border-red-500' : 'border-gray-300'
                    } ${isBlocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    placeholder="Ingresa la contraseña..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isBlocked}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>

              {/* Mensaje de error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 mr-3" />
                  <div>
                    <p className="text-red-700 text-sm">{error}</p>
                    {attempts > 0 && attempts < 3 && (
                      <p className="text-red-600 text-xs mt-1">
                        Intentos fallidos: {attempts}/3
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Botón de login */}
              <button
                type="submit"
                disabled={isBlocked || isLoading || !password.trim()}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verificando...
                  </>
                ) : isBlocked ? (
                  'Bloqueado temporalmente'
                ) : (
                  <>
                    <FontAwesomeIcon icon={faLock} className="mr-2" />
                    Acceder
                  </>
                )}
              </button>
            </form>

            {/* Información adicional */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">
                ℹ️ Información de Seguridad
              </h3>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• La sesión es válida por 24 horas</li>
                <li>• Se bloquea temporalmente tras 3 intentos fallidos</li>
                <li>• El acceso se registra por seguridad</li>
              </ul>
            </div>

            {/* Contacto */}
            <div className="mt-4 text-center text-xs text-gray-500">
              ¿Problemas de acceso? Contacta al administrador del sistema
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;