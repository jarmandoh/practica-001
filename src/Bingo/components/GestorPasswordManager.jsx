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

    // Actualizar el juego correspondiente si se seleccionó uno
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

      // Si la contraseña estaba asignada a un juego, limpiarla
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
      <span className="flex items-center gap-2">
        {game.name}
        {hasPassword && (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            <FontAwesomeIcon icon={faKey} className="mr-1" />
            Con contraseña
          </span>
        )}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Gestión de Contraseñas de Gestores</h2>
              <p className="text-purple-200 mt-1">Administra las credenciales de acceso para gestores</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 text-2xl"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Botón para crear nueva contraseña */}
          <div className="mb-6">
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Nueva Contraseña
            </button>
          </div>

          {/* Formulario */}
          {showForm && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {editingPassword ? 'Editar Contraseña' : 'Nueva Contraseña'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Gestor *
                    </label>
                    <input
                      type="text"
                      value={formData.gestorName}
                      onChange={(e) => setFormData({...formData, gestorName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:outline-none"
                      required
                      placeholder="Nombre del gestor"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:outline-none"
                        required
                        placeholder="Contraseña"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, password: generatePassword()})}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors"
                        title="Generar contraseña aleatoria"
                      >
                        <FontAwesomeIcon icon={faKey} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Asignar a Juego (Opcional)
                    </label>
                    <select
                      value={formData.gameId}
                      onChange={(e) => setFormData({...formData, gameId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:outline-none"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Contraseña activa</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción/Notas
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:outline-none"
                    rows="3"
                    placeholder="Descripción o notas adicionales"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    {editingPassword ? 'Actualizar' : 'Crear'} Contraseña
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de contraseñas */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                Contraseñas Registradas ({passwords.length})
              </h3>
            </div>

            {passwords.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gestor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contraseña
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Juego Asignado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Creado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {passwords.map((password) => (
                      <tr key={password.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {password.gestorName}
                          </div>
                          {password.description && (
                            <div className="text-sm text-gray-500">
                              {password.description}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                              {showPassword[password.id] ? password.password : '••••••••'}
                            </span>
                            <button
                              onClick={() => togglePasswordVisibility(password.id)}
                              className="text-gray-500 hover:text-gray-700"
                              title={showPassword[password.id] ? 'Ocultar' : 'Mostrar'}
                            >
                              <FontAwesomeIcon icon={showPassword[password.id] ? faEyeSlash : faEye} />
                            </button>
                            <button
                              onClick={() => copyToClipboard(password.password, password.id)}
                              className={`${
                                copiedPasswords[password.id] 
                                  ? 'text-green-600' 
                                  : 'text-gray-500 hover:text-gray-700'
                              }`}
                              title="Copiar contraseña"
                            >
                              <FontAwesomeIcon icon={copiedPasswords[password.id] ? faCheck : faCopy} />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {password.gameId ? getGameName(password.gameId) : 'Sin asignar'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => togglePasswordStatus(password.id)}
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              password.isActive 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                          >
                            {password.isActive ? 'Activa' : 'Inactiva'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(password.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(password)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Editar"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              onClick={() => handleDelete(password.id)}
                              className="text-red-600 hover:text-red-900"
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
              <div className="text-center py-12">
                <div className="text-6xl text-gray-300 mb-4">🔑</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No hay contraseñas registradas
                </h3>
                <p className="text-gray-500 mb-4">
                  Crea la primera contraseña para gestores
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors"
                >
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