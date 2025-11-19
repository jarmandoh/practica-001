import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './RoleCard.css';

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
    <div className="role-card">
      {/* Header */}
      <div 
        className={`role-card__header ${colors.gradient}`}
      >
        <div className="role-card__icon-wrapper">
          <FontAwesomeIcon icon={icon} className="role-card__icon" />
        </div>
        <h3 className="role-card__title">{title}</h3>
        <p className={`role-card__subtitle ${colors.subtitle}`}>{subtitle}</p>
      </div>
      
      {/* Content */}
      <div className="role-card__content">
        {/* Description */}
        {description && (
          <p className="role-card__description">{description}</p>
        )}

        {/* Features List */}
        <div className="role-card__features">
          {features.map((feature, index) => (
            <div key={index} className="role-card__feature">
              <div className={`role-card__feature-dot ${colors.dot}`}></div>
              {feature}
            </div>
          ))}
        </div>

        {/* Action Button */}
        <Link
          to={route}
          className={`role-card__button ${colors.button} ${colors.buttonHover}`}
        >
          <FontAwesomeIcon icon={buttonIcon} className="role-card__button-icon" />
          {buttonText}
        </Link>
        
        {/* Footer Text */}
        {footerText && (
          <p className="role-card__footer">
            {footerText}
          </p>
        )}
      </div>
    </div>
  );
};

export default RoleCard;
