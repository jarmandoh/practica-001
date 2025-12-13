import React, { useState } from 'react';
import './GestorLogin.css';

const GestorLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const result = onLogin(password);
    if (!result.success) {
      setError(result.error);
      setPassword('');
    }
  };

  return (
    <div className="gestor-login-container">
      <div className="gestor-login-card">
        <div className="gestor-icon">👨‍💼</div>
        <h2>Acceso Gestor</h2>
        <p className="subtitle">Panel de gestión de salas</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa la contraseña"
              autoFocus
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="btn-gestor">
            Acceder
          </button>
        </form>
      </div>
    </div>
  );
};

export default GestorLogin;
