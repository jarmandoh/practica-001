import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUser, faPhone, faEnvelope, faHashtag, faGamepad } from '@fortawesome/free-solid-svg-icons';
import './AssignmentForm.css';

const AssignmentForm = ({ assignment, isCardAssigned, onSubmit, onClose, currentRaffle, maxCards = 1200 }) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    participantName: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    paid: false,
    raffleId: currentRaffle || 1
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos si estamos editando
  useEffect(() => {
    if (assignment) {
      setFormData({
        cardNumber: assignment.cardNumber || assignment.startCard || '',
        participantName: assignment.participantName || `${assignment.firstName || ''} ${assignment.lastName || ''}`.trim(),
        firstName: assignment.firstName || '',
        lastName: assignment.lastName || '',
        phone: assignment.phone || '',
        email: assignment.email || '',
        paid: assignment.paid || false,
        raffleId: assignment.raffleId || assignment.raffleNumber || currentRaffle || 1
      });
    } else if (currentRaffle) {
      setFormData(prev => ({
        ...prev,
        raffleId: currentRaffle
      }));
    }
  }, [assignment, currentRaffle]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.cardNumber) {
      newErrors.cardNumber = 'El número de cartón es requerido';
    } else {
      const cardNum = parseInt(formData.cardNumber);
      if (isNaN(cardNum) || cardNum < 1 || cardNum > maxCards) {
        newErrors.cardNumber = `El número de cartón debe estar entre 1 y ${maxCards}`;
      } else if (!assignment && isCardAssigned(cardNum)) {
        newErrors.cardNumber = 'Este cartón ya está asignado';
      }
    }

    if (!formData.participantName.trim() && !formData.firstName.trim() && !formData.lastName.trim()) {
      newErrors.participantName = 'El nombre del participante es requerido';
    }

    if (formData.phone && formData.phone.trim() && !/^\+?[\d\s\-()]{8,}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Formato de teléfono inválido';
    }

    if (formData.email && formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Formato de email inválido';
    }

    const raffleToValidate = currentRaffle || formData.raffleId;
    if (!raffleToValidate || raffleToValidate < 1) {
      newErrors.raffleId = 'El ID del sorteo es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const processedData = {
        ...formData,
        cardNumber: parseInt(formData.cardNumber),
        participantName: formData.participantName.trim() || `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim().toLowerCase(),
        raffleId: currentRaffle || parseInt(formData.raffleId),
        raffleNumber: currentRaffle || parseInt(formData.raffleId),
        startCard: parseInt(formData.cardNumber),
        endCard: parseInt(formData.cardNumber),
        quantity: 1,
        createdAt: assignment?.createdAt || new Date().toISOString(),
        id: assignment?.id || Date.now().toString()
      };

      await onSubmit(processedData);
    } catch (error) {
      console.error('Error al guardar asignación:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const generateRandomCard = () => {
    const availableCards = [];
    for (let i = 1; i <= maxCards; i++) {
      if (!isCardAssigned(i)) {
        availableCards.push(i);
      }
    }
    
    if (availableCards.length > 0) {
      const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
      handleChange('cardNumber', randomCard.toString());
    }
  };

  return (
    <div className="assignment-form-overlay">
      <div className="assignment-form-container">
        {/* Header */}
        <div className="assignment-form-header">
          <div className="assignment-header-content">
            <h2 className="assignment-form-title">
              {assignment ? 'Editar Asignación' : 'Nueva Asignación'}
            </h2>
            <button onClick={onClose} className="assignment-close-button">
              <FontAwesomeIcon icon={faTimes} className="assignment-close-icon" />
            </button>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="assignment-form">
          {/* Número de cartón */}
          <div>
            <label className="assignment-label">
              <FontAwesomeIcon icon={faHashtag} className="assignment-label-icon" />
              Número de Cartón
            </label>
            <div className="assignment-card-input-group">
              <div className="assignment-input-flex">
                <input
                  type="number"
                  min="1"
                  max={maxCards}
                  value={formData.cardNumber}
                  onChange={(e) => handleChange('cardNumber', e.target.value)}
                  className={`assignment-input ${errors.cardNumber ? 'assignment-input-error' : ''}`}
                  placeholder="Ej: 123"
                />
                {errors.cardNumber && (
                  <p className="assignment-error">{errors.cardNumber}</p>
                )}
              </div>
              <button
                type="button"
                onClick={generateRandomCard}
                className="assignment-random-button"
                title="Generar cartón aleatorio disponible"
              >
                <FontAwesomeIcon icon={faGamepad} />
              </button>
            </div>
          </div>

          {/* Datos del participante */}
          <div className="assignment-section">
            <div>
              <label className="assignment-label">
                <FontAwesomeIcon icon={faUser} className="assignment-label-icon" />
                Nombre del Participante
              </label>
              <input
                type="text"
                value={formData.participantName}
                onChange={(e) => handleChange('participantName', e.target.value)}
                className={`assignment-input ${errors.participantName ? 'assignment-input-error' : ''}`}
                placeholder="Ej: Juan Pérez"
              />
              {errors.participantName && (
                <p className="assignment-error">{errors.participantName}</p>
              )}
            </div>

            {/* Datos adicionales */}
            <div className="assignment-grid">
              <div>
                <label className="assignment-label-optional">
                  Nombre (opcional)
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className="assignment-input"
                  placeholder="Ej: Juan"
                />
              </div>

              <div>
                <label className="assignment-label-optional">
                  Apellido (opcional)
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className="assignment-input"
                  placeholder="Ej: Pérez"
                />
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div className="assignment-grid">
            <div>
              <label className="assignment-label">
                <FontAwesomeIcon icon={faPhone} className="assignment-label-icon" />
                Teléfono (opcional)
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={`assignment-input ${errors.phone ? 'assignment-input-error' : ''}`}
                placeholder="Ej: +1234567890"
              />
              {errors.phone && (
                <p className="assignment-error">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="assignment-label">
                <FontAwesomeIcon icon={faEnvelope} className="assignment-label-icon" />
                Email (opcional)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`assignment-input ${errors.email ? 'assignment-input-error' : ''}`}
                placeholder="Ej: juan@email.com"
              />
              {errors.email && (
                <p className="assignment-error">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Configuración */}
          <div className="assignment-grid">
            <div>
              <label className="assignment-label-optional">
                ID del Sorteo
              </label>
              {currentRaffle ? (
                <>
                  <div className="assignment-input-readonly">
                    <span className="assignment-readonly-text">Sorteo {currentRaffle}</span>
                  </div>
                  <input type="hidden" value={currentRaffle} />
                </>
              ) : (
                <select
                  value={formData.raffleId}
                  onChange={(e) => handleChange('raffleId', parseInt(e.target.value))}
                  className={`assignment-select ${errors.raffleId ? 'assignment-input-error' : ''}`}
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Sorteo {i + 1}
                    </option>
                  ))}
                </select>
              )}
              {errors.raffleId && (
                <p className="assignment-error">{errors.raffleId}</p>
              )}
            </div>

            <div className="assignment-checkbox-wrapper">
              <label className="assignment-checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.paid}
                  onChange={(e) => handleChange('paid', e.target.checked)}
                  className="assignment-checkbox"
                />
                <span className="assignment-checkbox-text">
                  Marcado como pagado
                </span>
              </label>
            </div>
          </div>

          {/* Botones */}
          <div className="assignment-buttons">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="assignment-cancel-button"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="assignment-submit-button"
            >
              {isLoading ? (
                <>
                  <div className="assignment-spinner"></div>
                  Guardando...
                </>
              ) : (
                assignment ? 'Actualizar' : 'Crear Asignación'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentForm;
