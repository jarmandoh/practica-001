import React from 'react';

const ReservationSuccessModal = ({ 
  reservation, 
  onClose,
  settings 
}) => {
  if (!reservation) return null;

  const handleWhatsApp = () => {
    const phone = settings?.whatsappNumber?.replace(/\D/g, '') || '573001234567';
    const message = encodeURIComponent(
      `¡Hola! Acabo de realizar una reserva:\n\n` +
      `📋 Código: ${reservation.code}\n` +
      `📅 Fecha: ${new Date(reservation.date + 'T00:00:00').toLocaleDateString('es-CO')}\n` +
      `🕐 Horario: ${reservation.startTime} - ${reservation.endTime}\n\n` +
      `¿Podrían confirmarme la reserva?`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-[scale-in_0.3s_ease-out]">
        {/* Success Header */}
        <div className="bg-linear-to-r from-yellow-400 to-yellow-500 px-6 py-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-5xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">¡Reserva Exitosa!</h2>
          <p className="text-yellow-800 mt-2">Tu reserva ha sido registrada</p>
        </div>

        {/* Reservation Details */}
        <div className="p-6">
          {/* Código de reserva */}
          <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 text-center mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">Código de reserva</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
              {reservation.code}
            </p>
          </div>

          {/* Details Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <span>📅</span> Fecha
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {new Date(reservation.date + 'T00:00:00').toLocaleDateString('es-CO', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <span>🕐</span> Horario
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {reservation.startTime} - {reservation.endTime}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <span>💰</span> Total
              </span>
              <span className="font-bold text-red-600 dark:text-yellow-400 text-lg">
                ${reservation.price?.toLocaleString('es-CO')}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <span>📊</span> Estado
              </span>
              <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-medium">
                Pendiente de confirmación
              </span>
            </div>
          </div>

          {/* Info Note */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <span className="font-medium">📧 Nota:</span> Te hemos enviado un correo con los detalles de tu reserva. Recuerda que debes confirmar tu reserva contactándonos.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-3">
            <button
              onClick={handleWhatsApp}
              className="w-full py-3 bg-blue-800 hover:bg-blue-900 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <span>💬</span>
              Confirmar por WhatsApp
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationSuccessModal;
