import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUser, faPhone, faEnvelope, faHashtag, faGamepad } from '@fortawesome/free-solid-svg-icons';

const AssignmentForm = ({ assignment, isCardAssigned, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    paid: false,
    raffleId: 1
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos si estamos editando
  useEffect(() => {
    if (assignment) {
      setFormData({
        cardNumber: assignment.cardNumber,
        firstName: assignment.firstName,
        lastName: assignment.lastName,
        phone: assignment.phone,
        email: assignment.email,
        paid: assignment.paid,
        raffleId: assignment.raffleId
      });
    }
  }, [assignment]);

  const validateForm = () => {
    const newErrors = {};

    // Validar número de cartón
    if (!formData.cardNumber) {
      newErrors.cardNumber = 'El número de cartón es requerido';
    } else {
      const cardNum = parseInt(formData.cardNumber);
      if (isNaN(cardNum) || cardNum < 1 || cardNum > 1200) {
        newErrors.cardNumber = 'El número de cartón debe estar entre 1 y 1200';
      } else if (!assignment && isCardAssigned(cardNum)) {
        newErrors.cardNumber = 'Este cartón ya está asignado';
      }
    }

    // Validar nombre
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    // Validar apellido
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    // Validar teléfono
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^\+?[\d\s\-()]{8,}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Formato de teléfono inválido';
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Formato de email inválido';
    }

    // Validar sorteo
    if (!formData.raffleId || formData.raffleId < 1) {
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
      // Procesar datos antes de enviar
      const processedData = {
        ...formData,
        cardNumber: parseInt(formData.cardNumber),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim().toLowerCase(),
        raffleId: parseInt(formData.raffleId)
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
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const generateRandomCard = () => {
    const availableCards = [];
    for (let i = 1; i <= 1200; i++) {
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
    <div className="fixed inset-0 bg-[#000000cc] bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-linear-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {assignment ? 'Editar Asignación' : 'Nueva Asignación'}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-2 cursor-pointer"
            >
              <FontAwesomeIcon icon={faTimes} className="text-xl" />
            </button>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Número de cartón */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faHashtag} className="mr-2 text-purple-600" />
              Número de Cartón
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  min="1"
                  max="1200"
                  value={formData.cardNumber}
                  onChange={(e) => handleChange('cardNumber', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-300 focus:outline-none ${
                    errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: 123"
                />
                {errors.cardNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                )}
              </div>
              <button
                type="button"
                onClick={generateRandomCard}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Generar cartón aleatorio disponible"
              >
                <FontAwesomeIcon icon={faGamepad} />
              </button>
            </div>
          </div>

          {/* Datos personales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FontAwesomeIcon icon={faUser} className="mr-2 text-purple-600" />
                Nombre
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-300 focus:outline-none ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: Juan"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Apellido */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Apellido
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-300 focus:outline-none ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: Pérez"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Contacto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Teléfono */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FontAwesomeIcon icon={faPhone} className="mr-2 text-purple-600" />
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-300 focus:outline-none ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: +1234567890"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-purple-600" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-300 focus:outline-none ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: juan@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Configuración */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ID del sorteo */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                ID del Sorteo
              </label>
              <select
                value={formData.raffleId}
                onChange={(e) => handleChange('raffleId', parseInt(e.target.value))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-300 focus:outline-none ${
                  errors.raffleId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Sorteo {i + 1}
                  </option>
                ))}
              </select>
              {errors.raffleId && (
                <p className="text-red-500 text-sm mt-1">{errors.raffleId}</p>
              )}
            </div>

            {/* Estado de pago */}
            <div className="flex items-center">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.paid}
                  onChange={(e) => handleChange('paid', e.target.checked)}
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-300"
                />
                <span className="text-sm font-medium text-gray-700">
                  Marcado como pagado
                </span>
              </label>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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