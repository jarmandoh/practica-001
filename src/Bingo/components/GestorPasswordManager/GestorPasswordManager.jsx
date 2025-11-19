import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faTimes, 
  faKey, 
  faEye,
  faEyeSlash,
  faCopy,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import './GestorPasswordManager.css';

const GestorPasswordManager = ({ games, onUpdateGestorPassword, onClose }) => {
  const [passwords, setPasswords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPassword, setEditingPassword] = useState(null);
  const [formData, setFormData] = useState({
    gestorName: '',
    password: '',
    gameId: '',
    description: '',
    isActive: true
  });
  const [showPassword, setShowPassword] = useState({});
  const [copiedPasswords, setCopiedPasswords] = useState({});

  const GESTOR_PASSWORDS_KEY = 'gestorPasswords';

  useEffect(() => {
    loadPasswords();
  }, []);

  const loadPasswords = () => {
    try {
      const stored = localStorage.getItem(GESTOR_PASSWORDS_KEY);
      if (stored) {
        setPasswords(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error al cargar contraseñas:', error);
    }
  };

  const savePasswords = (updatedPasswords) => {
    localStorage.setItem(GESTOR_PASSWORDS_KEY, JSON.stringify(updatedPasswords));
    setPasswords(updatedPasswords);
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const passwordData = {
      id: editingPassword ? editingPassword.id : `pwd_${Date.now()}`,
      ...formData,
      createdAt: editingPassword ? editingPassword.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let updatedPasswords;
    if (editingPassword) {
      updatedPasswords = passwords.map(pwd => 
        pwd.id === editingPassword.id ? passwordData : pwd
      );
    } else {
      updatedPasswords = [...passwords, passwordData];
    }

    savePasswords(updatedPasswords);

    if (formData.gameId) {
      onUpdateGestorPassword(formData.gameId, formData.password, formData.gestorName);
    }

    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta contraseña?')) {
      const passwordToDelete = passwords.find(pwd => pwd.id === id);
      const updatedPasswords = passwords.filter(pwd => pwd.id !== id);
      savePasswords(updatedPasswords);

      if (passwordToDelete.gameId) {
        onUpdateGestorPassword(passwordToDelete.gameId, null, '');
      }
    }
  };

  const handleEdit = (password) => {
    setEditingPassword(password);
    setFormData(password);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      gestorName: '',
      password: '',
      gameId: '',
      description: '',
      isActive: true
    });
    setEditingPassword(null);
    setShowForm(false);
  };

  const togglePasswordVisibility = (id) => {
    setShowPassword(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = async (password, id) => {
    try {
      await navigator.clipboard.writeText(password);
      setCopiedPasswords(prev => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopiedPasswords(prev => ({ ...prev, [id]: false }));
      }, 2000);
    } catch (error) {
      console.error('Error al copiar:', error);
    }
  };

  const togglePasswordStatus = (id) => {
    const updatedPasswords = passwords.map(pwd => 
      pwd.id === id ? { ...pwd, isActive: !pwd.isActive } : pwd
    );
    savePasswords(updatedPasswords);
  };

  const getGameName = (gameId) => {
    const game = games.find(g => g.id === gameId);
    if (!game) return 'Juego no encontrado';
    
    const hasPassword = game.gestorPassword;
    return (
      <span className="gpm-game-name">
        {game.name}
        {hasPassword && (
          <span className="gpm-game-badge">
            <FontAwesomeIcon icon={faKey} className="mr-1" />
            Con contraseña
          </span>
        )}
      </span>
    );
  };

  return (
    <div className="gpm-overlay">
      <div className="gpm-container">
        {/* Header */}
        <div className="gpm-header">
          <div className="gpm-header-content">
            <div>
              <h2 className="gpm-title">Gestión de Contraseñas de Gestores</h2>
              <p className="gpm-subtitle">Administra las credenciales de acceso para gestores</p>
            </div>
            <button onClick={onClose} className="gpm-close-button">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>

        <div className="gpm-content">
          {/* Botón crear */}
          <div className="gpm-create-section">
            <button onClick={() => setShowForm(true)} className="gpm-create-button">
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Nueva Contraseña
            </button>
          </div>

          {/* Formulario */}
          {showForm && (
            <div className="gpm-form-container">
              <h3 className="gpm-form-title">
                {editingPassword ? 'Editar Contraseña' : 'Nueva Contraseña'}
              </h3>
              
              <form onSubmit={handleSubmit} className="gpm-form">
                <div className="gpm-form-grid">
                  <div>
                    <label className="gpm-label">Nombre del Gestor *</label>
                    <input
                      type="text"
                      value={formData.gestorName}
                      onChange={(e) => setFormData({...formData, gestorName: e.target.value})}
                      className="gpm-input"
                      required
                      placeholder="Nombre del gestor"
                    />
                  </div>

                  <div>
                    <label className="gpm-label">Contraseña *</label>
                    <div className="gpm-password-group">
                      <input
                        type="text"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="gpm-input"
                        required
                        placeholder="Contraseña"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, password: generatePassword()})}
                        className="gpm-generate-button"
                        title="Generar contraseña aleatoria"
                      >
                        <FontAwesomeIcon icon={faKey} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="gpm-form-grid">
                  <div>
                    <label className="gpm-label">Asignar a Juego (Opcional)</label>
                    <select
                      value={formData.gameId}
                      onChange={(e) => setFormData({...formData, gameId: e.target.value})}
                      className="gpm-select"
                    >
                      <option value="">Sin asignar a juego específico</option>
                      {games.map(game => (
                        <option key={game.id} value={game.id}>
                          {game.name} ({game.status}) {game.gestorPassword ? '🔐' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="gpm-label">Estado</label>
                    <label className="gpm-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        className="mr-2"
                      />
                      <span className="gpm-checkbox-text">Contraseña activa</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="gpm-label">Descripción/Notas</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="gpm-textarea"
                    rows="3"
                    placeholder="Descripción o notas adicionales"
                  />
                </div>

                <div className="gpm-form-buttons">
                  <button type="submit" className="gpm-submit-button">
                    {editingPassword ? 'Actualizar' : 'Crear'} Contraseña
                  </button>
                  <button type="button" onClick={resetForm} className="gpm-cancel-button">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de contraseñas */}
          <div className="gpm-list-container">
            <div className="gpm-list-header">
              <h3 className="gpm-list-title">
                Contraseñas Registradas ({passwords.length})
              </h3>
            </div>

            {passwords.length > 0 ? (
              <div className="gpm-table-wrapper">
                <table className="gpm-table">
                  <thead className="gpm-thead">
                    <tr>
                      <th className="gpm-th">Gestor</th>
                      <th className="gpm-th">Contraseña</th>
                      <th className="gpm-th">Juego Asignado</th>
                      <th className="gpm-th">Estado</th>
                      <th className="gpm-th">Creado</th>
                      <th className="gpm-th">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="gpm-tbody">
                    {passwords.map((password) => (
                      <tr key={password.id} className="gpm-tr">
                        <td className="gpm-td">
                          <div className="gpm-td-main">{password.gestorName}</div>
                          {password.description && (
                            <div className="gpm-td-desc">{password.description}</div>
                          )}
                        </td>
                        <td className="gpm-td">
                          <div className="gpm-password-cell">
                            <span className="gpm-password-display">
                              {showPassword[password.id] ? password.password : '••••••••'}
                            </span>
                            <button
                              onClick={() => togglePasswordVisibility(password.id)}
                              className="gpm-icon-button"
                              title={showPassword[password.id] ? 'Ocultar' : 'Mostrar'}
                            >
                              <FontAwesomeIcon icon={showPassword[password.id] ? faEyeSlash : faEye} />
                            </button>
                            <button
                              onClick={() => copyToClipboard(password.password, password.id)}
                              className={`gpm-icon-button ${copiedPasswords[password.id] ? 'gpm-icon-button-success' : ''}`}
                              title="Copiar contraseña"
                            >
                              <FontAwesomeIcon icon={copiedPasswords[password.id] ? faCheck : faCopy} />
                            </button>
                          </div>
                        </td>
                        <td className="gpm-td">
                          {password.gameId ? getGameName(password.gameId) : 'Sin asignar'}
                        </td>
                        <td className="gpm-td">
                          <button
                            onClick={() => togglePasswordStatus(password.id)}
                            className={`gpm-status-badge ${password.isActive ? 'gpm-status-active' : 'gpm-status-inactive'}`}
                          >
                            {password.isActive ? 'Activa' : 'Inactiva'}
                          </button>
                        </td>
                        <td className="gpm-td gpm-td-date">
                          {new Date(password.createdAt).toLocaleDateString()}
                        </td>
                        <td className="gpm-td">
                          <div className="gpm-actions">
                            <button
                              onClick={() => handleEdit(password)}
                              className="gpm-action-button gpm-action-edit"
                              title="Editar"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              onClick={() => handleDelete(password.id)}
                              className="gpm-action-button gpm-action-delete"
                              title="Eliminar"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="gpm-empty-state">
                <div className="gpm-empty-icon">🔑</div>
                <h3 className="gpm-empty-title">No hay contraseñas registradas</h3>
                <p className="gpm-empty-text">Crea la primera contraseña para gestores</p>
                <button onClick={() => setShowForm(true)} className="gpm-empty-button">
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Crear Primera Contraseña
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestorPasswordManager;
