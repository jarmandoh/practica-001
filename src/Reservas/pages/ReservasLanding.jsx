import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReservas } from '../context/ReservasContext';
import Banner from '../components/Banner';
import VideoSection from '../components/VideoSection';
import ReservationForm from '../components/ReservationForm';
import ReservationSuccessModal from '../components/ReservationSuccessModal';

const ReservasLanding = () => {
  const { courts, settings } = useReservas();
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [successReservation, setSuccessReservation] = useState(null);
  const reservationRef = useRef(null);

  const scrollToReservation = () => {
    if (reservationRef.current) {
      reservationRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    setShowReservationForm(true);
  };

  const handleReservationSuccess = (reservation) => {
    setSuccessReservation(reservation);
    setShowReservationForm(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🏟️</span>
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                {settings?.businessName || 'Canchas El Golazo'}
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <a href="#inicio" className="text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-yellow-400 transition-colors">
                Inicio
              </a>
              <Link to="/reservas/canchas" className="text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-yellow-400 transition-colors">
                Canchas
              </Link>
              <a href="#reservar" className="text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-yellow-400 transition-colors">
                Reservar
              </a>
              <a href="#contacto" className="text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-yellow-400 transition-colors">
                Contacto
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Link 
                to="/reservas/admin"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Admin
              </Link>
              <button
                onClick={scrollToReservation}
                className="px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white font-medium rounded-lg transition-colors"
              >
                Reservar
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <section id="inicio">
        <Banner 
          title={settings?.businessName || "Canchas El Golazo"}
          subtitle={settings?.businessDescription || "Las mejores canchas sintéticas de la ciudad para disfrutar del fútbol con amigos y familia"}
          ctaText="¡Reserva tu cancha ahora!"
          onCtaClick={scrollToReservation}
        />
      </section>

      {/* Features Section */}
      <section className="py-8 md:py-12 bg-white dark:bg-gray-900">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="text-center p-3 md:p-4">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-3">
                <span className="text-2xl md:text-3xl">⚽</span>
              </div>
              <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-white mb-1">3 Tipos de Canchas</h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Fútbol 5, 8 y 11</p>
            </div>
            <div className="text-center p-3 md:p-4">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-3">
                <span className="text-2xl md:text-3xl">🌙</span>
              </div>
              <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-white mb-1">Hasta las 11pm</h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Iluminación LED</p>
            </div>
            <div className="text-center p-3 md:p-4">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-red-100 dark:bg-red-900/30 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-3">
                <span className="text-2xl md:text-3xl">📱</span>
              </div>
              <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-white mb-1">Reserva Online</h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Fácil y rápido 24/7</p>
            </div>
            <div className="text-center p-3 md:p-4">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-3">
                <span className="text-2xl md:text-3xl">🏆</span>
              </div>
              <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-white mb-1">Calidad Premium</h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Césped de última gen.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <VideoSection 
        videoUrl="https://www.youtube.com/embed/kgL5_HRG5qE"
        title="Conoce Nuestras Instalaciones"
        description="Mira por qué somos la opción preferida para jugar fútbol en la ciudad"
        maxWidth="1200px"
      />

      {/* CTA - Ver Canchas */}
      <section className="py-8 md:py-10 bg-white dark:bg-gray-900">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <Link
            to="/reservas/canchas"
            className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded-lg transition-all transform hover:scale-105 shadow-md hover:shadow-lg text-sm md:text-base"
          >
            <span>🏟️</span>
            Ver Nuestras Canchas
          </Link>
        </div>
      </section>

      {/* Reservation Section */}
      <section id="reservar" ref={reservationRef} className="py-10 md:py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3">
              Reserva Tu Cancha
            </h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Selecciona tu cancha, fecha y horario preferido
            </p>
          </div>

          {showReservationForm ? (
            <div className="max-w-3xl mx-auto">
              <ReservationForm 
                onSuccess={handleReservationSuccess}
                onCancel={() => setShowReservationForm(false)}
              />
            </div>
          ) : (
            <div className="max-w-md mx-auto text-center">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl md:text-3xl">📅</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  ¿Listo para jugar?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Haz clic para iniciar tu reserva y asegurar tu cancha
                </p>
                <button
                  onClick={() => setShowReservationForm(true)}
                  className="px-6 py-3 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-md hover:shadow-lg text-sm md:text-base"
                >
                  Comenzar Reserva →
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Pricing Info Section */}
      <section className="py-10 md:py-12 bg-white dark:bg-gray-900">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Tarifas por Horario
            </h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              Precios especiales según la franja horaria
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              {/* Morning */}
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-3 md:p-4 border border-orange-200 dark:border-orange-800">
                <div className="text-center">
                  <span className="text-2xl md:text-3xl mb-1 block">🌅</span>
                  <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-white">Mañana</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">6AM - 12PM</p>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-2 md:p-3 mb-2">
                    <span className="text-xl md:text-2xl font-bold text-orange-600">-20%</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 hidden md:block">
                    Entrenamientos tempraneros
                  </p>
                </div>
              </div>

              {/* Afternoon */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-3 md:p-4 border-2 border-yellow-400 dark:border-yellow-700 shadow-md relative">
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold whitespace-nowrap">
                    POPULAR
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-2xl md:text-3xl mb-1 block">☀️</span>
                  <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-white">Tarde</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">12PM - 6PM</p>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-2 md:p-3 mb-2">
                    <span className="text-xl md:text-2xl font-bold text-yellow-600">100%</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 hidden md:block">
                    Horario más solicitado
                  </p>
                </div>
              </div>

              {/* Night */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-3 md:p-4 border border-indigo-200 dark:border-indigo-800">
                <div className="text-center">
                  <span className="text-2xl md:text-3xl mb-1 block">🌙</span>
                  <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-white">Noche</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">6PM - 11PM</p>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-2 md:p-3 mb-2">
                    <span className="text-xl md:text-2xl font-bold text-indigo-600">+20%</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 hidden md:block">
                    Iluminación LED
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-10 md:py-12 bg-gradient-to-br from-blue-800 to-blue-950">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Contact Info */}
              <div className="text-white">
                <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Contáctanos</h2>
                <p className="text-sm text-blue-100 mb-4">
                  ¿Tienes preguntas? Estamos aquí para ayudarte
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-base md:text-lg">📍</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-blue-200">Dirección</p>
                      <p className="text-sm font-medium truncate">{settings?.businessAddress || 'Calle 123 #45-67, Bogotá'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-base md:text-lg">📞</span>
                    </div>
                    <div>
                      <p className="text-xs text-blue-200">Teléfono</p>
                      <p className="text-sm font-medium">{settings?.businessPhone || '+57 300 123 4567'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-base md:text-lg">✉️</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-blue-200">Email</p>
                      <p className="text-sm font-medium truncate">{settings?.businessEmail || 'reservas@elgolazo.com'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-base md:text-lg">🕐</span>
                    </div>
                    <div>
                      <p className="text-xs text-blue-200">Horario</p>
                      <p className="text-sm font-medium">Lun-Dom: 6AM - 11PM</p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-4 flex gap-3">
                  <a 
                    href={`https://wa.me/${settings?.whatsappNumber?.replace(/\D/g, '') || '573001234567'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 md:w-10 md:h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                  >
                    💬
                  </a>
                  <a 
                    href={`https://instagram.com/${settings?.socialInstagram?.replace('@', '') || 'canchaselgolazo'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 md:w-10 md:h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                  >
                    📷
                  </a>
                  <a 
                    href={`https://facebook.com/${settings?.socialFacebook || 'CanchasElGolazo'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 md:w-10 md:h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                  >
                    👍
                  </a>
                </div>
              </div>

              {/* Quick Contact Form */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-5 shadow-lg">
                <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
                  Envíanos un mensaje
                </h3>
                <form className="space-y-3">
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    className="w-full px-3 py-2.5 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:text-white text-sm"
                  />
                  <input
                    type="email"
                    placeholder="Tu email"
                    className="w-full px-3 py-2.5 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:text-white text-sm"
                  />
                  <textarea
                    placeholder="Tu mensaje"
                    rows={3}
                    className="w-full px-3 py-2.5 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:text-white resize-none text-sm"
                  ></textarea>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg transition-colors text-sm"
                  >
                    Enviar Mensaje
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-4 md:py-6">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg md:text-xl">🏟️</span>
              <span className="font-bold text-sm md:text-base">{settings?.businessName || 'Canchas El Golazo'}</span>
            </div>
            <p className="text-gray-400 text-xs md:text-sm">
              © {new Date().getFullYear()} Todos los derechos reservados
            </p>
          </div>
        </div>
      </footer>

      {/* Success Modal */}
      {successReservation && (
        <ReservationSuccessModal
          reservation={successReservation}
          settings={settings}
          onClose={() => setSuccessReservation(null)}
        />
      )}
    </div>
  );
};

export default ReservasLanding;
