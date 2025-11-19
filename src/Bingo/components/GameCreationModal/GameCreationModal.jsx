import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faGamepad, 
  faThLarge,
  faPlus,
  faMinus,
  faCheck,
  faExclamationTriangle,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import './GameCreationModal.css';

const GameCreationModal = ({ onCreateGame, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxCards: 100,
    winPatterns: [],
    customPattern: Array(25).fill(false),
    enableCustomPattern: false
  });

  const [snackbar, setSnackbar] = useState({
    show: false,
    message: '',
    type: 'info'
  });

  const showSnackbar = (message, type = 'info') => {
    setSnackbar({ show: true, message, type });
  };

  useEffect(() => {
    if (snackbar.show) {
      const timer = setTimeout(() => {
        setSnackbar(prev => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbar.show]);

  const predefinedPatterns = [
    { id: 'horizontalLine1', name: 'Línea Horizontal 1', description: 'Completar la primera fila horizontal', icon: '▬' },
    { id: 'horizontalLine2', name: 'Línea Horizontal 2', description: 'Completar la segunda fila horizontal', icon: '▬' },
    { id: 'horizontalLine3', name: 'Línea Horizontal 3', description: 'Completar la tercera fila horizontal (centro)', icon: '▬' },
    { id: 'horizontalLine4', name: 'Línea Horizontal 4', description: 'Completar la cuarta fila horizontal', icon: '▬' },
    { id: 'horizontalLine5', name: 'Línea Horizontal 5', description: 'Completar la quinta fila horizontal', icon: '▬' },
    { id: 'letterI1', name: 'Letra B (Columna 1)', description: 'Completar la primera columna vertical', icon: '|' },
    { id: 'letterI2', name: 'Letra I (Columna 2)', description: 'Completar la segunda columna vertical', icon: '|' },
    { id: 'letterI3', name: 'Letra N (Columna 3)', description: 'Completar la tercera columna vertical (centro)', icon: '|' },
    { id: 'letterI4', name: 'Letra G (Columna 4)', description: 'Completar la cuarta columna vertical', icon: '|' },
    { id: 'letterI5', name: 'Letra O (Columna 5)', description: 'Completar la quinta columna vertical', icon: '|' },
    { id: 'diagonal', name: 'Diagonal', description: 'Completar cualquier diagonal', icon: '⧹' },
    { id: 'fourCorners', name: 'Cuatro Esquinas', description: 'Completar las cuatro esquinas del cartón', icon: '◸' },
    { id: 'letterX', name: 'Letra X', description: 'Formar una X con ambas diagonales', icon: '✗' },
    { id: 'letterT', name: 'Letra T', description: 'Primera fila completa y columna del medio', icon: '⊤' },
    { id: 'letterL', name: 'Letra L', description: 'Primera columna y última fila completas', icon: '⅃' },
    { id: 'cross', name: 'Cruz', description: 'Fila del medio y columna del medio completas', icon: '✛' },
    { id: 'fullCard', name: 'Cartón Completo', description: 'Completar todo el cartón', icon: '⬛' }
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
    
    setTimeout(() => {
      onCreateGame(gameData);
      onClose();
    }, 1000);
  };

  const renderPatternPreview = (patternId) => {
    const getPatternCells = () => {
      switch (patternId) {
        case 'horizontalLine1': return [0, 1, 2, 3, 4];
        case 'horizontalLine2': return [5, 6, 7, 8, 9];
        case 'horizontalLine3': return [10, 11, 12, 13, 14];
        case 'horizontalLine4': return [15, 16, 17, 18, 19];
        case 'horizontalLine5': return [20, 21, 22, 23, 24];
        case 'letterI1': return [0, 5, 10, 15, 20];
        case 'letterI2': return [1, 6, 11, 16, 21];
        case 'letterI3': return [2, 7, 12, 17, 22];
        case 'letterI4': return [3, 8, 13, 18, 23];
        case 'letterI5': return [4, 9, 14, 19, 24];
        case 'diagonal': return [0, 6, 12, 18, 24];
        case 'fourCorners': return [0, 4, 20, 24];
        case 'letterX': return [0, 4, 6, 8, 12, 16, 18, 20, 24];
        case 'letterT': return [0, 1, 2, 3, 4, 7, 12, 17, 22];
        case 'letterL': return [0, 5, 10, 15, 20, 21, 22, 23, 24];
        case 'cross': return [2, 7, 10, 11, 12, 13, 14, 17, 22];
        case 'fullCard': return Array.from({length: 25}, (_, i) => i);
        default: return [];
      }
    };

    const highlightedCells = getPatternCells();
    
    return (
      <div className="gcm-pattern-preview">
        {Array.from({length: 25}, (_, index) => {
          const isHighlighted = highlightedCells.includes(index);
          const isFree = index === 12;
          
          return (
            <div
              key={index}
              className={`gcm-preview-cell ${isHighlighted ? 'gcm-preview-highlighted' : ''} ${isFree ? 'gcm-preview-free' : ''}`}
            >
              {isFree ? 'F' : ''}
            </div>
          );
        })}
      </div>
    );
  };

  const renderCustomPatternGrid = () => {
    return (
      <div className="gcm-custom-grid">
        {formData.customPattern.map((isSelected, index) => {
          const row = Math.floor(index / 5);
          const col = index % 5;
          const isFreeSpace = row === 2 && col === 2;
          
          return (
            <button
              key={index}
              type="button"
              onClick={() => !isFreeSpace && handleCustomPatternToggle(index)}
              className={`gcm-custom-cell ${isFreeSpace ? 'gcm-custom-free' : ''} ${isSelected ? 'gcm-custom-selected' : ''}`}
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
    <div className="gcm-overlay">
      <div className="gcm-container">
        {/* Header */}
        <div className="gcm-header">
          <div className="gcm-header-content">
            <div>
              <h2 className="gcm-title">Crear Nuevo Juego</h2>
              <p className="gcm-subtitle">Configura las opciones del juego</p>
            </div>
            <button onClick={onClose} className="gcm-close-button">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="gcm-form">
          {/* Información básica */}
          <div className="gcm-section">
            <h3 className="gcm-section-title">
              <FontAwesomeIcon icon={faGamepad} className="mr-2" />
              Información del Juego
            </h3>
            
            <div className="gcm-grid">
              <div>
                <label className="gcm-label">Nombre del Juego *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="gcm-input"
                  placeholder="Ej: Bingo Familiar del Domingo"
                  required
                />
              </div>

              <div>
                <label className="gcm-label">Máximo de Cartones</label>
                <div className="gcm-number-input">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, maxCards: Math.max(10, formData.maxCards - 10)})}
                    className="gcm-number-button"
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
                    className="gcm-number-value"
                    min="1"
                    max="1200"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, maxCards: Math.min(1200, formData.maxCards + 10)})}
                    className="gcm-number-button"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
                <p className="gcm-help-text">Máximo: 1200 cartones disponibles</p>
              </div>
            </div>

            <div className="gcm-full">
              <label className="gcm-label">Descripción (Opcional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="gcm-textarea"
                rows="3"
                placeholder="Descripción del juego, reglas especiales, etc."
              />
            </div>
          </div>

          {/* Patrones de victoria */}
          <div className="gcm-section">
            <h3 className="gcm-section-title">
              <FontAwesomeIcon icon={faThLarge} className="mr-2" />
              Patrones de Victoria
            </h3>
            
            <div className="gcm-patterns-grid">
              {predefinedPatterns.map((pattern) => (
                <label
                  key={pattern.id}
                  className={`gcm-pattern-card ${formData.winPatterns.includes(pattern.id) ? 'gcm-pattern-selected' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={formData.winPatterns.includes(pattern.id)}
                    onChange={() => handlePatternToggle(pattern.id)}
                    className="gcm-pattern-checkbox"
                  />
                  <div className="gcm-pattern-header">
                    <span className="gcm-pattern-icon">{pattern.icon}</span>
                    {formData.winPatterns.includes(pattern.id) && (
                      <FontAwesomeIcon icon={faCheck} className="gcm-pattern-check" />
                    )}
                  </div>
                  
                  {renderPatternPreview(pattern.id)}
                  
                  <h4 className="gcm-pattern-name">{pattern.name}</h4>
                  <p className="gcm-pattern-desc">{pattern.description}</p>
                </label>
              ))}
            </div>
          </div>

          {/* Patrón personalizado */}
          <div className="gcm-section">
            <div className="gcm-custom-header">
              <h3 className="gcm-section-title">Patrón Personalizado</h3>
              <label className="gcm-checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.enableCustomPattern}
                  onChange={(e) => setFormData({...formData, enableCustomPattern: e.target.checked})}
                  className="mr-2"
                />
                <span className="gcm-checkbox-text">Habilitar patrón personalizado</span>
              </label>
            </div>

            {formData.enableCustomPattern && (
              <div className="gcm-custom-container">
                <p className="gcm-custom-help">
                  Haz clic en las casillas para crear tu patrón de victoria personalizado
                </p>
                
                {renderCustomPatternGrid()}
                
                <div className="gcm-custom-buttons">
                  <button
                    type="button"
                    onClick={clearCustomPattern}
                    className="gcm-custom-button gcm-custom-clear"
                  >
                    Limpiar Todo
                  </button>
                  <button
                    type="button"
                    onClick={fillCustomPattern}
                    className="gcm-custom-button gcm-custom-fill"
                  >
                    Marcar Todo
                  </button>
                </div>
                
                <div className="gcm-custom-info">
                  <p className="gcm-custom-count">
                    Casillas marcadas: {formData.customPattern.filter(Boolean).length}/24
                    <br />
                    (El espacio FREE del centro no cuenta)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="gcm-actions">
            <button
              type="submit"
              disabled={!formData.name.trim() || (formData.winPatterns.length === 0 && !formData.enableCustomPattern)}
              className="gcm-submit-button"
            >
              Crear Juego
            </button>
            <button
              type="button"
              onClick={onClose}
              className="gcm-cancel-button"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
      
      {/* Snackbar */}
      {snackbar.show && (
        <div className="gcm-snackbar">
          <div className={`gcm-snackbar-content gcm-snackbar-${snackbar.type}`}>
            <FontAwesomeIcon 
              icon={snackbar.type === 'error' || snackbar.type === 'warning' ? faExclamationTriangle : faInfoCircle} 
              className="gcm-snackbar-icon" 
            />
            <span className="gcm-snackbar-text">{snackbar.message}</span>
            <button
              onClick={() => setSnackbar(prev => ({ ...prev, show: false }))}
              className="gcm-snackbar-close"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameCreationModal;
