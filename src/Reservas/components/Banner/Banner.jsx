import React from 'react';
import defaultBannerImage from '../../../assets/image_field.jpg';

const Banner = ({ 
  title = "Canchas El Golazo",
  subtitle = "Las mejores canchas sintéticas de la ciudad",
  backgroundImage = null,
  showCTA = true,
  ctaText = "Reserva Ahora",
  onCtaClick = () => {}
}) => {
  return (
    <div className="relative h-[420px] md:h-[450px] lg:h-[480px] overflow-hidden">
      {/* Background Image or Gradient */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage || defaultBannerImage})`
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-blue-900/60 via-black/40 to-yellow-900/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center pt-12 md:pt-8">
        {/* Logo/Icon */}
        <div className="mb-3 md:mb-4">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-yellow-400/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto border-2 md:border-4 border-yellow-400/50">
            <span className="text-3xl md:text-4xl">🏟️</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-3 drop-shadow-lg">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg lg:text-xl text-white/90 mb-4 md:mb-6 max-w-xl drop-shadow px-2">
          {subtitle}
        </p>

        {/* CTA Button */}
        {showCTA && (
          <button
            onClick={onCtaClick}
            className="px-6 py-3 md:px-8 md:py-3 bg-blue-800 hover:bg-blue-900 text-white font-bold text-sm md:text-base rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center gap-2"
          >
            <span>📅</span>
            {ctaText}
          </button>
        )}

        {/* Features Pills */}
        <div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-2 md:gap-3">
          <div className="px-3 py-1.5 md:px-4 md:py-2 bg-yellow-400/20 backdrop-blur-sm rounded-full text-white text-xs md:text-sm flex items-center gap-1.5">
            <span>⚽</span>
            <span>Fútbol 5</span>
          </div>
          <div className="px-3 py-1.5 md:px-4 md:py-2 bg-blue-700/30 backdrop-blur-sm rounded-full text-white text-xs md:text-sm flex items-center gap-1.5">
            <span>⚽</span>
            <span>Fútbol 8</span>
          </div>
          <div className="px-3 py-1.5 md:px-4 md:py-2 bg-red-600/30 backdrop-blur-sm rounded-full text-white text-xs md:text-sm flex items-center gap-1.5">
            <span>🏟️</span>
            <span>Fútbol 11</span>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            className="fill-white dark:fill-gray-900"
          />
        </svg>
      </div>
    </div>
  );
};

export default Banner;
