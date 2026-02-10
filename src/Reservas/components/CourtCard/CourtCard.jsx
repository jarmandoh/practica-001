import React from 'react';
import { COURT_TYPES } from '../../data/courtsConfig';
import defaultCourtImage from '../../../assets/cancha_01.jpg';

const CourtCard = ({ 
  court, 
  onSelect, 
  isSelected = false,
  showPrice = true,
  showDetails = true,
  compact = false
}) => {
  const courtType = COURT_TYPES[court.type?.toUpperCase()?.replace('-', '_')] || COURT_TYPES.FUTBOL_5;

  return (
    <div 
      onClick={() => onSelect?.(court)}
      className={`
        relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg 
        transition-all duration-300 cursor-pointer
        ${isSelected 
          ? 'ring-4 ring-yellow-500 shadow-yellow-200 dark:shadow-yellow-900/30 transform scale-[1.02]' 
          : 'hover:shadow-xl hover:transform hover:scale-[1.01]'
        }
        ${compact ? 'p-4' : ''}
      `}
    >
      {/* Selected Badge */}
      {isSelected && (
        <div className="absolute top-3 right-3 z-10 bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Seleccionada
        </div>
      )}

      {/* Image Section */}
      {!compact && (
        <div className="relative h-36 md:h-44 bg-linear-to-br from-blue-700 to-blue-900 overflow-hidden">
          <img 
            src={court.images?.[0] || defaultCourtImage} 
            alt={court.name}
            className="w-full h-full object-cover"
          />
          
          {/* Court Type Badge */}
          <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-xs font-medium">
            {courtType.name}
          </div>

          {/* Status Badge */}
          {court.isActive !== undefined && (
            <div className={`absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium ${
              court.isActive 
                ? 'bg-yellow-500 text-gray-900' 
                : 'bg-red-500 text-white'
            }`}>
              {court.isActive ? 'Disponible' : 'No disponible'}
            </div>
          )}
        </div>
      )}

      {/* Content Section */}
      <div className={compact ? '' : 'p-3 md:p-4'}>
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
              {court.name}
            </h3>
            {compact && (
              <span className="text-xs md:text-sm text-blue-700 dark:text-yellow-400 font-medium">
                {courtType.name}
              </span>
            )}
          </div>
          {showPrice && court.pricing?.basePrice && (
            <div className="text-right">
              <span className="text-xs text-gray-500 dark:text-gray-400">Desde</span>
              <p className="text-sm md:text-base font-bold text-red-600 dark:text-yellow-400">
                ${(court.pricing.basePrice * 0.8).toLocaleString('es-CO')}
              </p>
            </div>
          )}
        </div>

        {/* Description */}
        {showDetails && court.description && (
          <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm mb-2 md:mb-3 line-clamp-2">
            {court.description}
          </p>
        )}

        {/* Dimensions */}
        {showDetails && (
          <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <span>📐</span>
              <span>{courtType.dimensions}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>👥</span>
              <span>{courtType.playersPerTeam}v{courtType.playersPerTeam}</span>
            </div>
          </div>
        )}

        {/* Amenities */}
        {showDetails && court.amenities && court.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {court.amenities.slice(0, compact ? 2 : 4).map((amenity, index) => (
              <span 
                key={index}
                className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] md:text-xs text-gray-600 dark:text-gray-300"
              >
                {amenity}
              </span>
            ))}
            {court.amenities.length > (compact ? 2 : 4) && (
              <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] md:text-xs text-gray-600 dark:text-gray-300">
                +{court.amenities.length - (compact ? 2 : 4)}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourtCard;
