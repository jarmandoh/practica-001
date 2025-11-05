import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const RoleCard = ({ 
  icon, 
  title, 
  subtitle, 
  description, 
  features, 
  buttonText, 
  buttonIcon, 
  route, 
  colors,
  footerText 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300">
      {/* Header */}
      <div 
        className={`bg-linear-to-r ${colors.gradient} text-white p-8 text-center`}
      >
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <FontAwesomeIcon icon={icon} className="text-4xl" />
        </div>
        <h3 className="text-3xl font-bold mb-2">{title}</h3>
        <p className={`${colors.subtitle}`}>{subtitle}</p>
      </div>
      
      {/* Content */}
      <div className="p-8">
        {/* Description */}
        {description && (
          <p className="text-gray-600 mb-6">{description}</p>
        )}

        {/* Features List */}
        <div className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center text-gray-700">
              <div className={`w-2 h-2 ${colors.dot} rounded-full mr-3`}></div>
              {feature}
            </div>
          ))}
        </div>

        {/* Action Button */}
        <Link
          to={route}
          className={`w-full ${colors.button} hover:${colors.buttonHover} text-white font-bold py-4 px-6 rounded-xl transition-colors inline-flex items-center justify-center text-lg`}
        >
          <FontAwesomeIcon icon={buttonIcon} className="mr-3" />
          {buttonText}
        </Link>
        
        {/* Footer Text */}
        {footerText && (
          <p className="text-sm text-gray-500 text-center mt-4">
            {footerText}
          </p>
        )}
      </div>
    </div>
  );
};

export default RoleCard;