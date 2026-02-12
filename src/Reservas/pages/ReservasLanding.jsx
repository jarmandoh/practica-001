import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReservas } from '../context/ReservasContext';
import Banner from '../components/Banner';
import VideoSection from '../components/VideoSection';
import ReservationForm from '../components/ReservationForm';
import ReservationSuccessModal from '../components/ReservationSuccessModal';

const ReservasLanding = () => {
  const { settings } = useReservas();
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
    <div className="min-h-screen bg-linear-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-linear-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center transform group-hover:rotate-3 transition-transform">
                <span className="text-xl">⚽</span>
              </div>
              <span className="font-black text-xl text-gray-900 dark:text-white" style={{ fontFamily: "'Exo 2', sans-serif" }}>
                {settings?.businessName || 'Canchas El Golazo'}
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#inicio" className="relative text-gray-600 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors font-semibold text-sm group">
                Inicio
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <Link to="/reservas/canchas" className="relative text-gray-600 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors font-semibold text-sm group">
                Canchas
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <a href="#reservar" className="relative text-gray-600 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors font-semibold text-sm group">
                Reservar
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#contacto" className="relative text-gray-600 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors font-semibold text-sm group">
                Contacto
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Link 
                to="/reservas/admin"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 font-medium transition-colors"
              >
                Admin
              </Link>
              <button
                onClick={scrollToReservation}
                className="px-5 py-2.5 bg-linear-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-sky-500/30"
                style={{ fontFamily: "'Exo 2', sans-serif" }}
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
      <section className="py-12 md:py-16 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(14, 165, 233, 0.1) 35px, rgba(14, 165, 233, 0.1) 70px)" }}></div>
        
        <div className="max-w-[1200px] mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: '⚽', title: '3 Tipos de Canchas', desc: 'Fútbol 5, 8 y 11', color: 'from-sky-500 to-sky-600', delay: '0s' },
              { icon: '🌙', title: 'Hasta las 11pm', desc: 'Iluminación LED', color: 'from-blue-500 to-blue-600', delay: '0.1s' },
              { icon: '📱', title: 'Reserva Online', desc: 'Fácil y rápido 24/7', color: 'from-amber-500 to-amber-600', delay: '0.2s' },
              { icon: '🏆', title: 'Calidad Premium', desc: 'Césped de última gen.', color: 'from-purple-500 to-purple-600', delay: '0.3s' }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-default"
                style={{ animationDelay: feature.delay }}
              >
                {/* Gradient Border Effect */}
                <div className={`absolute inset-0 bg-linear-to-br ${feature.color} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Icon Container */}
                <div className={`relative w-16 h-16 md:w-20 md:h-20 bg-linear-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <span className="text-3xl md:text-4xl">{feature.icon}</span>
                </div>
                
                <h3 className="font-black text-sm md:text-base text-gray-900 dark:text-white mb-2 text-center" style={{ fontFamily: "'Exo 2', sans-serif" }}>
                  {feature.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 text-center">
                  {feature.desc}
                </p>
              </div>
            ))}
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
      <section className="py-10 md:py-12 relative overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-linear-to-r from-sky-500/5 via-amber-500/5 to-sky-500/5"></div>
        
        <div className="max-w-[1200px] mx-auto px-4 text-center relative z-10">
          <Link
            to="/reservas/canchas"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-gray-900 font-black rounded-2xl transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl text-base md:text-lg relative overflow-hidden"
            style={{ fontFamily: "'Exo 2', sans-serif" }}
          >
            {/* Shine Effect */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <span className="text-2xl group-hover:scale-125 transition-transform">🏟️</span>
            <span className="relative z-10">Ver Nuestras Canchas</span>
            <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Reservation Section */}
      <section id="reservar" ref={reservationRef} className="py-12 md:py-16 bg-linear-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-40 h-40 bg-sky-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-60 h-60 bg-amber-400/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-[1200px] mx-auto px-4 relative z-10">
          <div className="text-center mb-8 md:mb-10">
            <div className="inline-block mb-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-linear-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                <span className="text-3xl md:text-4xl">📅</span>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-3" style={{ fontFamily: "'Exo 2', sans-serif" }}>
              Reserva Tu Cancha
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Selecciona tu cancha, fecha y horario preferido. ¡Es fácil y rápido!
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
            <div className="max-w-lg mx-auto">
              <div className="group relative bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-10 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-linear-to-br from-sky-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Content */}
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-linear-to-br from-sky-100 to-sky-200 dark:from-sky-900/30 dark:to-sky-800/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <span className="text-4xl md:text-5xl">👋</span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3" style={{ fontFamily: "'Exo 2', sans-serif" }}>
                    ¿Listo para jugar?
                  </h3>
                  
                  <p className="text-base text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    Haz clic para iniciar tu reserva y asegurar tu cancha en minutos
                  </p>
                  
                  <button
                    onClick={() => setShowReservationForm(true)}
                    className="group/btn relative px-8 py-4 bg-linear-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold rounded-2xl transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl text-base md:text-lg overflow-hidden"
                    style={{ fontFamily: "'Exo 2', sans-serif" }}
                  >
                    {/* Button Shine */}
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                    
                    <span className="relative z-10 flex items-center gap-2">
                      Comenzar Reserva
                      <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Pricing Info Section */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(14, 165, 233, 0.1) 35px, rgba(14, 165, 233, 0.1) 70px)" }}></div>
        
        <div className="max-w-[1200px] mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-3" style={{ fontFamily: "'Exo 2', sans-serif" }}>
              Tarifas por Horario
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
              Precios especiales según la franja horaria
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {/* Morning */}
              <div className="group relative bg-linear-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-3xl p-6 border-2 border-orange-200 dark:border-orange-800 hover:border-orange-400 dark:hover:border-orange-600 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                {/* Discount Badge */}
                <div className="absolute -top-3 -right-3 w-16 h-16 bg-linear-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <span className="text-white font-black text-xs" style={{ fontFamily: "'Exo 2', sans-serif" }}>-20%</span>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                    <span className="text-3xl">🌅</span>
                  </div>
                  <h3 className="font-black text-lg text-gray-900 dark:text-white mb-1" style={{ fontFamily: "'Exo 2', sans-serif" }}>Mañana</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-semibold">6AM - 12PM</p>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 shadow-inner">
                    <span className="text-3xl font-black bg-linear-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent" style={{ fontFamily: "'Exo 2', sans-serif" }}>-20%</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    🏋️ Entrenamientos tempraneros
                  </p>
                </div>
              </div>

              {/* Afternoon - Featured */}
              <div className="group relative bg-linear-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-3xl p-6 border-4 border-amber-400 dark:border-amber-600 shadow-xl hover:shadow-3xl hover:-translate-y-3 transition-all duration-500 transform md:scale-105">
                {/* Popular Badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-linear-to-r from-amber-500 to-amber-600 text-white px-6 py-2 rounded-full text-sm font-black shadow-lg" style={{ fontFamily: "'Exo 2', sans-serif" }}>
                    ⭐ MÁS POPULAR
                  </div>
                </div>
                
                <div className="text-center mt-2">
                  <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-4xl">☀️</span>
                  </div>
                  <h3 className="font-black text-xl text-gray-900 dark:text-white mb-1" style={{ fontFamily: "'Exo 2', sans-serif" }}>Tarde</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-semibold">12PM - 6PM</p>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 shadow-lg">
                    <span className="text-4xl font-black bg-linear-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent" style={{ fontFamily: "'Exo 2', sans-serif" }}>100%</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    🔥 Horario más solicitado
                  </p>
                </div>
              </div>

              {/* Night */}
              <div className="group relative bg-linear-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-3xl p-6 border-2 border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                {/* Premium Badge */}
                <div className="absolute -top-3 -right-3 w-16 h-16 bg-linear-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <span className="text-white font-black text-xs" style={{ fontFamily: "'Exo 2', sans-serif" }}>+20%</span>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                    <span className="text-3xl">🌙</span>
                  </div>
                  <h3 className="font-black text-lg text-gray-900 dark:text-white mb-1" style={{ fontFamily: "'Exo 2', sans-serif" }}>Noche</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-semibold">6PM - 11PM</p>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 shadow-inner">
                    <span className="text-3xl font-black bg-linear-to-r from-indigo-500 to-indigo-600 bg-clip-text text-transparent" style={{ fontFamily: "'Exo 2', sans-serif" }}>+20%</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    💡 Iluminación LED premium
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tournament / Events Section */}
      <section className="py-14 md:py-20 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-sky-950 to-slate-900"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-400 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-400 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3"></div>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left Content */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-400/30 rounded-full mb-6">
                <span className="text-lg">🏆</span>
                <span className="text-amber-300 text-sm font-bold" style={{ fontFamily: "'Exo 2', sans-serif" }}>TORNEOS Y EVENTOS</span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-5 leading-tight" style={{ fontFamily: "'Exo 2', sans-serif" }}>
                ¿Organizas un{' '}
                <span className="bg-linear-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
                  torneo
                </span>
                ?
              </h2>

              <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Contamos con canchas ideales para torneos relámpago, ligas empresariales y eventos deportivos. 
                Ofrecemos <span className="text-amber-400 font-bold">descuentos especiales</span> y paquetes personalizados 
                para grupos grandes.
              </p>

              {/* Features List */}
              <div className="space-y-4 mb-8">
                {[
                  { icon: '💰', text: 'Descuentos por volumen de reservas' },
                  { icon: '📋', text: 'Organización y logística del evento' },
                  { icon: '🏅', text: 'Premiación y vallas publicitarias disponibles' },
                  { icon: '📊', text: 'Gestión de tablas de posiciones y fixtures' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                      <span className="text-lg">{item.icon}</span>
                    </div>
                    <span className="text-gray-200 font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <a
                href="#contacto"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-gray-900 font-black rounded-2xl transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl text-base relative overflow-hidden"
                style={{ fontFamily: "'Exo 2', sans-serif" }}
              >
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="text-xl">📩</span>
                <span className="relative z-10">Contactar para Torneos</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>

            {/* Right - Promo Cards */}
            <div className="space-y-4">
              {[
                { 
                  title: 'Torneo Relámpago', 
                  desc: 'Ideal para grupos de 4-8 equipos. Duración de un día completo con arbitraje incluido.',
                  icon: '⚡', 
                  color: 'from-amber-500/20 to-amber-600/20',
                  border: 'border-amber-500/30',
                  badge: 'Más Popular'
                },
                { 
                  title: 'Liga Empresarial', 
                  desc: 'Torneos semanales para empresas. Incluye premiación y fotografía oficial.',
                  icon: '🏢', 
                  color: 'from-sky-500/20 to-sky-600/20',
                  border: 'border-sky-500/30',
                  badge: null
                },
                { 
                  title: 'Evento Especial', 
                  desc: 'Cumpleaños, despedidas, team building. Personalizamos tu experiencia deportiva.',
                  icon: '🎉', 
                  color: 'from-purple-500/20 to-purple-600/20',
                  border: 'border-purple-500/30',
                  badge: null
                }
              ].map((card, i) => (
                <div key={i} className={`group relative bg-linear-to-br ${card.color} backdrop-blur-sm rounded-2xl p-5 border ${card.border} hover:scale-[1.02] transition-all duration-300`}>
                  {card.badge && (
                    <span className="absolute -top-2.5 right-4 px-3 py-1 bg-amber-500 text-gray-900 text-xs font-black rounded-full shadow-lg">
                      {card.badge}
                    </span>
                  )}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <span className="text-3xl">{card.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white mb-1" style={{ fontFamily: "'Exo 2', sans-serif" }}>{card.title}</h3>
                      <p className="text-sm text-gray-300 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>{card.desc}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Promo Note */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center">
                <p className="text-gray-300 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  💬 Escríbenos por el <a href="#contacto" className="text-amber-400 font-bold hover:underline">formulario de contacto</a> o 
                  por <a href={`https://wa.me/${settings?.whatsappNumber?.replace(/\D/g, '') || '573001234567'}`} target="_blank" rel="noopener noreferrer" className="text-green-400 font-bold hover:underline">WhatsApp</a> para 
                  cotizar tu evento con descuentos exclusivos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-12 md:py-16 bg-linear-to-br from-sky-600 via-sky-700 to-sky-800 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="max-w-[1200px] mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {/* Contact Info */}
              <div className="text-white">
                <div className="mb-6">
                  <div className="inline-block p-3 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
                    <span className="text-4xl">📞</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black mb-3" style={{ fontFamily: "'Exo 2', sans-serif" }}>Contáctanos</h2>
                  <p className="text-base text-sky-100">
                    ¿Tienes preguntas? Estamos aquí para ayudarte
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: '📍', label: 'Dirección', value: settings?.businessAddress || 'Calle 123 #45-67, Bogotá' },
                    { icon: '📞', label: 'Teléfono', value: settings?.businessPhone || '+57 300 123 4567' },
                    { icon: '✉️', label: 'Email', value: settings?.businessEmail || 'reservas@elgolazo.com' },
                    { icon: '🕐', label: 'Horario', value: 'Lun-Dom: 6AM - 11PM' }
                  ].map((item, index) => (
                    <div key={index} className="group flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <span className="text-2xl">{item.icon}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-sky-200 font-medium mb-1">{item.label}</p>
                        <p className="text-sm font-semibold truncate">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social Links */}
                <div className="mt-6 flex gap-3">
                  {[
                    { icon: '💬', url: `https://wa.me/${settings?.whatsappNumber?.replace(/\D/g, '') || '573001234567'}` },
                    { icon: '📷', url: `https://instagram.com/${settings?.socialInstagram?.replace('@', '') || 'canchaselgolazo'}` },
                    { icon: '👍', url: `https://facebook.com/${settings?.socialFacebook || 'CanchasElGolazo'}` }
                  ].map((social, index) => (
                    <a 
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
                    >
                      <span className="text-2xl">{social.icon}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl">
                <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-5" style={{ fontFamily: "'Exo 2', sans-serif" }}>
                  Envíanos un mensaje
                </h3>
                <form className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      className="w-full px-4 py-3.5 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl focus:ring-2 focus:ring-sky-500 dark:text-white text-sm font-medium transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Tu email"
                      className="w-full px-4 py-3.5 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl focus:ring-2 focus:ring-sky-500 dark:text-white text-sm font-medium transition-all"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Tu mensaje"
                      rows={4}
                      className="w-full px-4 py-3.5 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl focus:ring-2 focus:ring-sky-500 dark:text-white resize-none text-sm font-medium transition-all"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-linear-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl text-base"
                    style={{ fontFamily: "'Exo 2', sans-serif" }}
                  >
                    Enviar Mensaje ✉️
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 md:py-10">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-linear-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🏟️</span>
              </div>
              <div>
                <span className="font-black text-lg block" style={{ fontFamily: "'Exo 2', sans-serif" }}>
                  {settings?.businessName || 'Canchas El Golazo'}
                </span>
                <span className="text-xs text-gray-400">Tu mejor opción deportiva</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
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
