import React from 'react';
import { Link } from 'react-router-dom';
import './FichasLanding.css';

const FichasLanding = () => {
  return (
    <div className="fichas-landing">
      <div className="landing-content">
        <div className="hero-section">
          <h1>🎲 Juego de Fichas a 100</h1>
          <p className="hero-subtitle">
            ¡Acércate lo más posible a 100 sin pasarte!
          </p>
          <div className="game-description">
            <h3>¿Cómo se juega?</h3>
            <ul>
              <li>🎯 Cada jugador debe llegar lo más cerca posible de 100 puntos</li>
              <li>🎲 Las fichas van del 1 al 99, y se reparten de forma única</li>
              <li>💰 Haz tu apuesta antes de empezar cada ronda</li>
              <li>🔄 Pide fichas en tu turno o plántate cuando quieras</li>
              <li>⚠️ Si te pasas de 100, quedas eliminado</li>
              <li>🏆 El más cercano a 100 gana el pozo completo</li>
            </ul>
          </div>
        </div>

        <div className="role-selection">
          <h2>Selecciona tu rol</h2>
          
          <div className="roles-grid">
            <Link to="/fichas/player" className="role-card player">
              <div className="role-icon">👤</div>
              <h3>Jugador</h3>
              <p>Únete a una sala y juega contra otros jugadores</p>
            </Link>

            <Link to="/fichas/admin" className="role-card admin">
              <div className="role-icon">🔐</div>
              <h3>Administrador</h3>
              <p>Gestiona salas y supervisa el juego</p>
            </Link>

            <Link to="/fichas/gestor" className="role-card gestor">
              <div className="role-icon">👨‍💼</div>
              <h3>Gestor</h3>
              <p>Crea y administra salas de juego</p>
            </Link>
          </div>
        </div>

        <div className="game-rules">
          <h3>Reglas del Juego</h3>
          <div className="rules-content">
            <div className="rule">
              <strong>1. Apuesta Inicial:</strong>
              <p>Todos los jugadores deben hacer su apuesta para comenzar la ronda.</p>
            </div>
            <div className="rule">
              <strong>2. Turnos:</strong>
              <p>Cada jugador tiene su turno para pedir fichas. Puedes pedir tantas como quieras o plantarte.</p>
            </div>
            <div className="rule">
              <strong>3. Segunda Apuesta:</strong>
              <p>Después de que todos los jugadores terminen, hay una segunda ronda de apuestas.</p>
            </div>
            <div className="rule">
              <strong>4. Revelación:</strong>
              <p>Se revelan todos los puntajes. El jugador más cercano a 100 gana el pozo.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FichasLanding;
