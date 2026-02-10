import React, { useState, useEffect } from 'react';
import { useReservas } from '../../context/ReservasContext';
import CourtCard from '../CourtCard';
import TimeSlotPicker from '../TimeSlotPicker';

const ReservationForm = ({ onSuccess, onCancel }) => {
  const { courts, getAvailableSlots, createReservation, settings } = useReservas();
  
  const [step, setStep] = useState(1);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [customerData, setCustomerData] = useState({
    fullName: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [filterType, setFilterType] = useState('all');

  // Obtener fecha mínima (hoy o mañana según la hora)
  const getMinDate = () => {
    const now = new Date();
    const minAdvanceHours = settings?.minAdvanceHours || 2;
    now.setHours(now.getHours() + minAdvanceHours);
    return now.toISOString().split('T')[0];
  };

  // Obtener fecha máxima
  const getMaxDate = () => {
    const max = new Date();
    const maxAdvanceDays = settings?.maxAdvanceDays || 30;
    max.setDate(max.getDate() + maxAdvanceDays);
    return max.toISOString().split('T')[0];
  };

  // Cargar horarios cuando cambia la cancha o fecha
  useEffect(() => {
    if (selectedCourt && selectedDate) {
      setLoadingSlots(true);
      // Simular delay de red
      setTimeout(() => {
        const slots = getAvailableSlots(selectedCourt.id, selectedDate);
        setAvailableSlots(slots);
        setLoadingSlots(false);
        setSelectedSlot(null);
      }, 300);
    }
  }, [selectedCourt, selectedDate, getAvailableSlots]);

  // Filtrar canchas activas
  const activeCourts = courts.filter(c => c.isActive !== false);
  
  // Filtrar por tipo
  const filteredCourts = filterType === 'all' 
    ? activeCourts 
    : activeCourts.filter(c => c.type === filterType);

  // Validar datos del cliente
  const validateCustomerData = () => {
    const newErrors = {};
    
    if (!customerData.fullName.trim()) {
      newErrors.fullName = 'El nombre es requerido';
    }
    
    if (!customerData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(customerData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!customerData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^\+?[\d\s-]{7,15}$/.test(customerData.phone)) {
      newErrors.phone = 'Teléfono inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar selección de cancha
  const handleSelectCourt = (court) => {
    setSelectedCourt(court);
    setSelectedSlot(null);
    setAvailableSlots([]);
  };

  // Manejar cambio de fecha
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedSlot(null);
  };

  // Manejar envío del formulario
  const handleSubmit = async () => {
    if (!validateCustomerData()) return;
    
    setSubmitting(true);
    
    try {
      const result = createReservation({
        courtId: selectedCourt.id,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        customer: customerData
      });

      if (result.success) {
        onSuccess?.(result.reservation);
      } else {
        setErrors({ submit: result.error });
      }
    } catch (_error) {
      setErrors({ submit: 'Error al crear la reserva. Por favor intenta de nuevo.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Navegar entre pasos
  const goToStep = (newStep) => {
    setStep(newStep);
  };

  const canProceedToStep2 = selectedCourt !== null;
  const canProceedToStep3 = selectedSlot !== null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
      {/* Progress Steps */}
      <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b dark:border-gray-700">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {[
            { num: 1, label: 'Cancha' },
            { num: 2, label: 'Horario' },
            { num: 3, label: 'Datos' }
          ].map((s, index) => (
            <React.Fragment key={s.num}>
              <div 
                className={`flex items-center gap-2 cursor-pointer ${
                  step >= s.num ? 'text-blue-700' : 'text-gray-400'
                }`}
                onClick={() => s.num < step && goToStep(s.num)}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  step >= s.num 
                    ? 'bg-blue-800 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  {step > s.num ? '✓' : s.num}
                </div>
                <span className="hidden sm:inline font-medium">{s.label}</span>
              </div>
              {index < 2 && (
                <div className={`flex-1 h-1 mx-2 rounded ${
                  step > s.num ? 'bg-blue-800' : 'bg-gray-200 dark:bg-gray-700'
                }`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        {/* Step 1: Seleccionar Cancha */}
        {step === 1 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Selecciona tu cancha
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Elige la cancha que mejor se adapte a tus necesidades
            </p>

            {/* Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filterType === 'all'
                    ? 'bg-blue-800 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilterType('futbol_5')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filterType === 'futbol_5'
                    ? 'bg-blue-800 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                ⚽ Fútbol 5
              </button>
              <button
                onClick={() => setFilterType('futbol_8')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filterType === 'futbol_8'
                    ? 'bg-blue-800 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                ⚽ Fútbol 8
              </button>
              <button
                onClick={() => setFilterType('futbol_11')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filterType === 'futbol_11'
                    ? 'bg-blue-800 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                🏟️ Fútbol 11
              </button>
            </div>

            {/* Courts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {filteredCourts.map(court => (
                <CourtCard
                  key={court.id}
                  court={court}
                  isSelected={selectedCourt?.id === court.id}
                  onSelect={handleSelectCourt}
                />
              ))}
            </div>

            {filteredCourts.length === 0 && (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <span className="text-5xl mb-4 block">🔍</span>
                <p className="text-gray-500 dark:text-gray-400">
                  No hay canchas disponibles con este filtro
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Seleccionar Fecha y Hora */}
        {step === 2 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Elige fecha y horario
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Selecciona cuándo quieres jugar en <span className="font-semibold text-blue-700">{selectedCourt?.name}</span>
            </p>

            {/* Date Picker */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                📅 Fecha
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                min={getMinDate()}
                max={getMaxDate()}
                className="w-full md:w-auto px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  🕐 Horario disponible
                </label>
                <TimeSlotPicker
                  slots={availableSlots}
                  selectedSlot={selectedSlot}
                  onSelectSlot={setSelectedSlot}
                  loading={loadingSlots}
                />
              </div>
            )}
          </div>
        )}

        {/* Step 3: Datos del Cliente */}
        {step === 3 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Completa tu reserva
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Ingresa tus datos para confirmar la reserva
            </p>

            {/* Reservation Summary */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-800 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-3">📋 Resumen de tu reserva</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Cancha:</span>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedCourt?.name}</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Fecha:</span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-CO', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Horario:</span>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedSlot?.label}</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Precio:</span>
                  <p className="font-bold text-red-600 dark:text-yellow-400 text-lg">{selectedSlot?.formattedPrice}</p>
                </div>
              </div>
            </div>

            {/* Customer Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  value={customerData.fullName}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, fullName: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 dark:text-white ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Juan Pérez"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={customerData.email}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 dark:text-white ${
                    errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="juan@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 dark:text-white ${
                    errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="+57 300 123 4567"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notas adicionales (opcional)
                </label>
                <textarea
                  value={customerData.notes}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Algún comentario especial..."
                />
              </div>

              {errors.submit && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
                  {errors.submit}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-t dark:border-gray-700 flex justify-between">
        <button
          onClick={() => step > 1 ? goToStep(step - 1) : onCancel?.()}
          className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
        >
          {step > 1 ? '← Anterior' : 'Cancelar'}
        </button>

        {step < 3 ? (
          <button
            onClick={() => goToStep(step + 1)}
            disabled={step === 1 ? !canProceedToStep2 : !canProceedToStep3}
            className="px-6 py-2 bg-blue-800 hover:bg-blue-900 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
          >
            Siguiente →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-900 font-medium rounded-xl transition-colors flex items-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Procesando...
              </>
            ) : (
              <>
                ✓ Confirmar Reserva
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ReservationForm;
