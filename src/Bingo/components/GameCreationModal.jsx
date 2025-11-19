import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faGamepad, 
  faUsers,
  faPlus,
  faMinus,
  faCheck,
  faThLarge,
  faExclamationTriangle,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';

const GameCreationModal = ({ onCreateGame, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxCards: 100,
    winPatterns: [],
    customPattern: Array(25).fill(false), // 5x5 grid para el patrón personalizado
    enableCustomPattern: false
  });

  const [snackbar, setSnackbar] = useState({
    show: false,
    message: '',
    type: 'info' // 'info', 'error', 'warning', 'success'
  });

  // Función para mostrar snackbar
  const showSnackbar = (message, type = 'info') => {
    setSnackbar({ show: true, message, type });
  };

  // Auto-hide snackbar después de 3 segundos
  useEffect(() => {
    if (snackbar.show) {
      const timer = setTimeout(() => {
        setSnackbar(prev => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbar.show]);

  // Componente Snackbar
  const Snackbar = () => {
    if (!snackbar.show) return null;

    const getSnackbarStyle = () => {
      switch (snackbar.type) {
        case 'error':
          return 'bg-red-500 text-white';
        case 'warning':
          return 'bg-yellow-500 text-white';
        case 'success':
          return 'bg-green-500 text-white';
        default:
          return 'bg-blue-500 text-white';
      }
    };

    const getIcon = () => {
      switch (snackbar.type) {
        case 'error':
        case 'warning':
          return faExclamationTriangle;
        default:
          return faInfoCircle;
      }
    };

    return (
      <div className="fixed top-4 right-4 z-60 transition-all duration-300 ease-in-out transform translate-x-0">
        <div className={`${getSnackbarStyle()} px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-[400px]`}>
          <FontAwesomeIcon icon={getIcon()} className="shrink-0" />
          <span className="flex-1">{snackbar.message}</span>
          <button
            onClick={() => setSnackbar(prev => ({ ...prev, show: false }))}
            className="shrink-0 text-white hover:text-gray-200 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
    );
  };

  // Patrones de victoria predefinidos
  const predefinedPatterns = [
    {
      id: 'horizontalLine1',
      name: 'Línea Horizontal 1',
      description: 'Completar la primera fila horizontal',
      icon: '▬'
    },
    {
      id: 'horizontalLine2',
      name: 'Línea Horizontal 2',
      description: 'Completar la segunda fila horizontal',
      icon: '▬'
    },
    {
      id: 'horizontalLine3',
      name: 'Línea Horizontal 3',
      description: 'Completar la tercera fila horizontal (centro)',
      icon: '▬'
    },
    {
      id: 'horizontalLine4',
      name: 'Línea Horizontal 4',
      description: 'Completar la cuarta fila horizontal',
      icon: '▬'
    },
    {
      id: 'horizontalLine5',
      name: 'Línea Horizontal 5',
      description: 'Completar la quinta fila horizontal',
      icon: '▬'
    },
    {
      id: 'letterI1',
      name: 'Letra B (Columna 1)',
      description: 'Completar la primera columna vertical',
      icon: '|'
    },
    {
      id: 'letterI2',
      name: 'Letra I (Columna 2)',
      description: 'Completar la segunda columna vertical',
      icon: '|'
    },
    {
      id: 'letterI3',
      name: 'Letra N (Columna 3)',
      description: 'Completar la tercera columna vertical (centro)',
      icon: '|'
    },
    {
      id: 'letterI4',
      name: 'Letra G (Columna 4)',
      description: 'Completar la cuarta columna vertical',
      icon: '|'
    },
    {
      id: 'letterI5',
      name: 'Letra O (Columna 5)',
      description: 'Completar la quinta columna vertical',
      icon: '|'
    },
    {
      id: 'diagonal',
      name: 'Diagonal',
      description: 'Completar cualquier diagonal',
      icon: '⧹'
    },
    {
      id: 'fourCorners',
      name: 'Cuatro Esquinas',
      description: 'Completar las cuatro esquinas del cartón',
      icon: '◸'
    },
    {
      id: 'letterX',
      name: 'Letra X',
      description: 'Formar una X con ambas diagonales',
      icon: '✗'
    },
    {
      id: 'letterT',
      name: 'Letra T',
      description: 'Primera fila completa y columna del medio',
      icon: '⊤'
    },
    {
      id: 'letterL',
      name: 'Letra L',
      description: 'Primera columna y última fila completas',
      icon: '⅃'
    },
    {
      id: 'cross',
      name: 'Cruz',
      description: 'Fila del medio y columna del medio completas',
      icon: '✛'
    },
    {
      id: 'fullCard',
      name: 'Cartón Completo',
      description: 'Completar todo el cartón',
      icon: '⬛'
    }
  ];

  const handlePatternToggle = (patternId) => {
    setFormData(prev => ({
      ...prev,
      winPatterns: prev.winPatterns.includes(patternId)
        ? prev.winPatterns.filter(p => p !== patternId)
        : [...prev.winPatterns, patternId]
    }));
  };

  const handleCustomPatternToggle = (index) => {
    setFormData(prev => ({
      ...prev,
      customPattern: prev.customPattern.map((cell, i) => 
        i === index ? !cell : cell
      )
    }));
  };

  const clearCustomPattern = () => {
    setFormData(prev => ({
      ...prev,
      customPattern: Array(25).fill(false)
    }));
  };

  const renderPatternPreview = (patternId) => {
    const getPatternCells = () => {
      switch (patternId) {
        // Líneas horizontales específicas
        case 'horizontalLine1':
          return [0, 1, 2, 3, 4]; // Primera fila
        case 'horizontalLine2':
          return [5, 6, 7, 8, 9]; // Segunda fila
        case 'horizontalLine3':
          return [10, 11, 12, 13, 14]; // Tercera fila (centro)
        case 'horizontalLine4':
          return [15, 16, 17, 18, 19]; // Cuarta fila
        case 'horizontalLine5':
          return [20, 21, 22, 23, 24]; // Quinta fila
        
        // Columnas verticales (Letra I)
        case 'letterI1':
          return [0, 5, 10, 15, 20]; // Primera columna
        case 'letterI2':
          return [1, 6, 11, 16, 21]; // Segunda columna
        case 'letterI3':
          return [2, 7, 12, 17, 22]; // Tercera columna (centro)
        case 'letterI4':
          return [3, 8, 13, 18, 23]; // Cuarta columna
        case 'letterI5':
          return [4, 9, 14, 19, 24]; // Quinta columna
        
        case 'diagonal':
          return [0, 6, 12, 18, 24]; // Diagonal principal
        case 'fourCorners':
          return [0, 4, 20, 24]; // Cuatro esquinas
        case 'letterX':
          return [0, 4, 6, 8, 12, 16, 18, 20, 24]; // Ambas diagonales
        case 'letterT':
          return [0, 1, 2, 3, 4, 7, 12, 17, 22]; // T
        case 'letterL':
          return [0, 5, 10, 15, 20, 21, 22, 23, 24]; // L
        case 'cross':
          return [2, 7, 10, 11, 12, 13, 14, 17, 22]; // Cruz
        case 'fullCard':
          return Array.from({length: 25}, (_, i) => i); // Todo el cartón
        default:
          return [];
      }
    };

    const highlightedCells = getPatternCells();
    
    return (
      <div className="grid grid-cols-5 gap-0.5 w-16 h-16 mx-auto mb-2">
        {Array.from({length: 25}, (_, index) => {
          const isHighlighted = highlightedCells.includes(index);
          const isFree = index === 12;
          
          return (
            <div
              key={index}
              className={`
                w-2.5 h-2.5 border border-gray-300 text-[6px] flex items-center justify-center
                ${isHighlighted 
                  ? 'bg-purple-500' 
                  : isFree 
                    ? 'bg-yellow-200' 
                    : 'bg-white'
                }
              `}
            >
              {isFree ? 'F' : ''}
            </div>
          );
        })}
      </div>
    );
  };

  const fillCustomPattern = () => {
    setFormData(prev => ({
      ...prev,
      customPattern: Array(25).fill(true)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showSnackbar('El nombre del juego es obligatorio', 'error');
      return;
    }

    if (formData.winPatterns.length === 0 && !formData.enableCustomPattern) {
      showSnackbar('Debe seleccionar al menos un patrón de victoria', 'error');
      return;
    }

    if (formData.enableCustomPattern && !formData.customPattern.some(cell => cell)) {
      showSnackbar('Debe marcar al menos una casilla en el patrón personalizado', 'error');
      return;
    }

    const gameData = {
      name: formData.name,
      description: formData.description,
      maxCards: formData.maxCards,
      winPatterns: formData.winPatterns,
      customPattern: formData.enableCustomPattern ? formData.customPattern : null
    };

    showSnackbar('¡Juego creado exitosamente!', 'success');
    
    // Pequeño delay para mostrar el snackbar antes de cerrar
    setTimeout(() => {
      onCreateGame(gameData);
      onClose();
    }, 1000);
  };

  const renderCustomPatternGrid = () => {
    return (
      <div className="grid grid-cols-5 gap-1 w-40 mx-auto">
        {formData.customPattern.map((isSelected, index) => {
          const row = Math.floor(index / 5);
          const col = index % 5;
          const isFreeSpace = row === 2 && col === 2; // Centro del cartón (espacio libre)
          
          return (
            <button
              key={index}
              type="button"
              onClick={() => !isFreeSpace && handleCustomPatternToggle(index)}
              className={`
                w-8 h-8 border border-gray-300 text-xs font-bold rounded
                ${isFreeSpace 
                  ? 'bg-yellow-200 text-yellow-800 cursor-not-allowed' 
                  : isSelected 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white hover:bg-gray-100 cursor-pointer'
                }
              `}
              disabled={isFreeSpace}
              title={isFreeSpace ? 'Espacio libre' : `Posición ${row + 1}-${col + 1}`}
            >
              {isFreeSpace ? 'FREE' : isSelected ? '✓' : ''}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Crear Nuevo Juego</h2>
              <p className="text-purple-200 mt-1">Configura las opciones del juego</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 text-2xl"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Información básica */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FontAwesomeIcon icon={faGamepad} className="mr-2 text-purple-600" />
              Información del Juego
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Juego *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:outline-none"
                  placeholder="Ej: Bingo Familiar del Domingo"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Máximo de Cartones
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, maxCards: Math.max(10, formData.maxCards - 10)})}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-8 h-8 rounded flex items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                  <input
                    type="number"
                    value={formData.maxCards}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      if (value > 1200) {
                        showSnackbar('Máximo 1200 cartones permitidos', 'warning');
                        setFormData({...formData, maxCards: 1200});
                      } else {
                        setFormData({...formData, maxCards: Math.max(1, value)});
                      }
                    }}
                    onBlur={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      if (value > 1200) {
                        setFormData({...formData, maxCards: 1200});
                      } else if (value < 1) {
                        setFormData({...formData, maxCards: 1});
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:outline-none text-center"
                    min="1"
                    max="1200"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, maxCards: Math.min(1200, formData.maxCards + 10)})}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-8 h-8 rounded flex items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Máximo: 1200 cartones disponibles</p>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción (Opcional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:outline-none"
                rows="3"
                placeholder="Descripción del juego, reglas especiales, etc."
              />
            </div>
          </div>

          {/* Patrones de victoria */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FontAwesomeIcon icon={faThLarge} className="mr-2 text-purple-600" />
              Patrones de Victoria
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              {predefinedPatterns.map((pattern) => (
                <label
                  key={pattern.id}
                  className={`
                    border-2 rounded-lg p-3 cursor-pointer transition-colors
                    ${formData.winPatterns.includes(pattern.id)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={formData.winPatterns.includes(pattern.id)}
                    onChange={() => handlePatternToggle(pattern.id)}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{pattern.icon}</span>
                    {formData.winPatterns.includes(pattern.id) && (
                      <FontAwesomeIcon icon={faCheck} className="text-purple-600" />
                    )}
                  </div>
                  
                  {/* Minivisualización del patrón */}
                  {renderPatternPreview(pattern.id)}
                  
                  <h4 className="font-medium text-gray-800 text-sm mb-1">
                    {pattern.name}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {pattern.description}
                  </p>
                </label>
              ))}
            </div>
          </div>

          {/* Patrón personalizado */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <FontAwesomeIcon icon={faUsers} className="mr-2 text-purple-600" />
                Patrón Personalizado
              </h3>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.enableCustomPattern}
                  onChange={(e) => setFormData({...formData, enableCustomPattern: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Habilitar patrón personalizado</span>
              </label>
            </div>

            {formData.enableCustomPattern && (
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-sm text-gray-600 mb-4 text-center">
                  Haz clic en las casillas para crear tu patrón de victoria personalizado
                </p>
                
                {renderCustomPatternGrid()}
                
                <div className="flex justify-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={clearCustomPattern}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded text-sm"
                  >
                    Limpiar Todo
                  </button>
                  <button
                    type="button"
                    onClick={fillCustomPattern}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                  >
                    Marcar Todo
                  </button>
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    Casillas marcadas: {formData.customPattern.filter(Boolean).length}/24
                    <br />
                    (El espacio FREE del centro no cuenta)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={!formData.name.trim() || (formData.winPatterns.length === 0 && !formData.enableCustomPattern)}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-3 rounded-lg transition-colors font-medium"
            >
              Crear Juego
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg transition-colors font-medium"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
      
      {/* Snackbar */}
      <Snackbar />
    </div>
  );
};

export default GameCreationModal;