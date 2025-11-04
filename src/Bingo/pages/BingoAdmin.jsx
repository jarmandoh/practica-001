import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faSearch, 
  faPlus, 
  faEdit, 
  faTrash, 
  faTrophy,
  faCheck,
  faTimes,
  faEye,
  faChartBar,
  faSignOutAlt,
  faGamepad,
  faPlay,
  faStop,
  faCog
} from '@fortawesome/free-solid-svg-icons';
import { useBingoAdmin } from '../hooks/useBingoAdmin';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { useGameManager } from '../hooks/useGameManager';
import AssignmentForm from '../components/AssignmentForm';
import AssignmentStats from '../components/AssignmentStats';
import BingoControls from '../components/BingoControls';
import NumberDisplay from '../components/NumberDisplay';

const BingoAdmin = () => {
  const { logout, getTimeUntilExpiry } = useAdminAuth();
  const {
    currentRaffle,
    setCurrentRaffle,
    assignCard,
    updateAssignment,
    removeAssignment,
    markAsWinner,
    searchAssignments,
    isCardAssigned,
    getAssignmentsByRaffle,
    getStats
  } = useBingoAdmin();

  const {
    games,
    currentGame,
    createGame,
    startGame,
    finishGame,
    deleteGame,
    setCurrentGame,
    addCalledNumber
  } = useGameManager();

  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [viewMode, setViewMode] = useState('games'); // 'games', 'assignments', 'search'
  const [showGameForm, setShowGameForm] = useState(false);
  const [newGameName, setNewGameName] = useState('');

  // Filtrar asignaciones según el modo de vista
  const filteredAssignments = viewMode === 'search' 
    ? searchAssignments(searchTerm, searchType)
    : getAssignmentsByRaffle(currentRaffle);

  // Paginación
  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAssignments = filteredAssignments.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFormSubmit = (formData) => {
    if (editingAssignment) {
      updateAssignment(editingAssignment.id, formData);
      setEditingAssignment(null);
    } else {
      assignCard(formData);
    }
    setShowForm(false);
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta asignación?')) {
      removeAssignment(id);
    }
  };

  const handleCreateGame = () => {
    if (newGameName.trim()) {
      createGame(newGameName);
      setNewGameName('');
      setShowGameForm(false);
    }
  };

  const handleStartGame = (gameId) => {
    startGame(gameId);
    setCurrentGame(gameId);
  };

  const handleFinishGame = (gameId) => {
    if (window.confirm('¿Estás seguro de que quieres finalizar este juego?')) {
      finishGame(gameId);
    }
  };

  const handleDeleteGame = (gameId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este juego permanentemente?')) {
      deleteGame(gameId);
    }
  };

  const stats = getStats();
  const timeLeft = getTimeUntilExpiry();

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-600 to-blue-600 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Administrador de Bingo</h1>
              <p className="text-purple-100">Gestiona las asignaciones de cartones y participantes</p>
              {timeLeft.valid && (
                <p className="text-purple-200 text-sm mt-1">
                  🕒 Sesión expira en: {timeLeft.hours}h {timeLeft.minutes}m
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <Link 
                to="/bingo" 
                className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition duration-300 inline-flex items-center"
              >
                <FontAwesomeIcon icon={faHome} className="mr-2" />
                Juego Principal
              </Link>
              <button
                onClick={() => setShowForm(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-300 inline-flex items-center"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Nueva Asignación
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-300 inline-flex items-center"
                title="Cerrar sesión"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                Salir
              </button>
            </div>
          </div>

          {/* Controles de vista */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('games')}
                className={`px-4 py-2 rounded-lg transition duration-300 ${
                  viewMode === 'games' 
                    ? 'bg-white text-purple-600 font-semibold' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <FontAwesomeIcon icon={faGamepad} className="mr-2" />
                Gestión de Juegos
              </button>
              <button
                onClick={() => setViewMode('assignments')}
                className={`px-4 py-2 rounded-lg transition duration-300 ${
                  viewMode === 'assignments' 
                    ? 'bg-white text-purple-600 font-semibold' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <FontAwesomeIcon icon={faChartBar} className="mr-2" />
                Asignaciones
              </button>
              <button
                onClick={() => setViewMode('search')}
                className={`px-4 py-2 rounded-lg transition duration-300 ${
                  viewMode === 'search' 
                    ? 'bg-white text-purple-600 font-semibold' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <FontAwesomeIcon icon={faSearch} className="mr-2" />
                Búsqueda
              </button>
            </div>

            {viewMode === 'assignments' && (
              <div className="flex items-center gap-2">
                <label className="text-white font-medium">Sorteo:</label>
                <select
                  value={currentRaffle}
                  onChange={(e) => setCurrentRaffle(Number(e.target.value))}
                  className="px-3 py-2 bg-white rounded-lg text-gray-700 border-0 focus:ring-2 focus:ring-purple-300"
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Sorteo {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {viewMode === 'games' && (
              <button
                onClick={() => setShowGameForm(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-300 inline-flex items-center"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Crear Juego
              </button>
            )}
          </div>

          {/* Barra de búsqueda para modo búsqueda */}
          {viewMode === 'search' && (
            <div className="mt-4 flex gap-4">
              <div className="flex-1 relative">
                <FontAwesomeIcon 
                  icon={faSearch} 
                  className="absolute left-3 top-3 text-gray-400" 
                />
                <input
                  type="text"
                  placeholder="Buscar por número de cartón, teléfono, email o nombre..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border-0 focus:ring-2 focus:ring-purple-300 focus:outline-none text-gray-700"
                />
              </div>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="px-4 py-3 bg-white rounded-lg text-gray-700 border-0 focus:ring-2 focus:ring-purple-300"
              >
                <option value="all">Todos los campos</option>
                <option value="cardNumber">Número de cartón</option>
                <option value="phone">Teléfono</option>
                <option value="email">Email</option>
                <option value="name">Nombre</option>
              </select>
            </div>
          )}
        </div>

        {/* Estadísticas - solo mostrar en modo asignaciones */}
        {viewMode === 'assignments' && (
          <AssignmentStats stats={stats} currentRaffle={currentRaffle} />
        )}

        {/* Gestión de Juegos */}
        {viewMode === 'games' && (
          <>
            {/* Juego actual si existe */}
            {currentGame && (
              <div className="bg-white rounded-xl shadow-2xl p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                      Juego Activo: {currentGame.name}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>ID: {currentGame.id}</span>
                      <span className={`px-3 py-1 rounded-full text-white ${
                        currentGame.status === 'active' ? 'bg-green-500' :
                        currentGame.status === 'waiting' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}>
                        {currentGame.status === 'active' ? 'Activo' :
                         currentGame.status === 'waiting' ? 'En Espera' : 'Finalizado'}
                      </span>
                      <span>Números cantados: {currentGame.calledNumbers?.length || 0}/75</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {currentGame.status === 'waiting' && (
                      <button
                        onClick={() => handleStartGame(currentGame.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <FontAwesomeIcon icon={faPlay} className="mr-2" />
                        Iniciar
                      </button>
                    )}
                    {currentGame.status === 'active' && (
                      <button
                        onClick={() => handleFinishGame(currentGame.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <FontAwesomeIcon icon={faStop} className="mr-2" />
                        Finalizar
                      </button>
                    )}
                  </div>
                </div>

                {/* Controles de Bingo */}
                {currentGame.status === 'active' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <NumberDisplay 
                        currentNumber={currentGame.currentNumber}
                        calledNumbers={currentGame.calledNumbers || []}
                      />
                    </div>
                    <div>
                      <BingoControls 
                        onCallNumber={(number) => addCalledNumber(currentGame.id, number)}
                        calledNumbers={currentGame.calledNumbers || []}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Lista de juegos */}
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Todos los Juegos ({games.length})
                </h2>
              </div>

              {games.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nombre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Creado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Números
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {games.map((game) => (
                        <tr key={game.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {game.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {game.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              game.status === 'active' ? 'bg-green-100 text-green-800' :
                              game.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {game.status === 'active' ? 'Activo' :
                               game.status === 'waiting' ? 'En Espera' :
                               'Finalizado'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(game.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {game.calledNumbers?.length || 0}/75
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              {game.status === 'waiting' && (
                                <button
                                  onClick={() => handleStartGame(game.id)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Iniciar juego"
                                >
                                  <FontAwesomeIcon icon={faPlay} />
                                </button>
                              )}
                              {game.status === 'active' && (
                                <button
                                  onClick={() => handleFinishGame(game.id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Finalizar juego"
                                >
                                  <FontAwesomeIcon icon={faStop} />
                                </button>
                              )}
                              {game.status !== 'active' && (
                                <button
                                  onClick={() => handleDeleteGame(game.id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Eliminar juego"
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              )}
                              <button
                                onClick={() => setCurrentGame(game.id)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Seleccionar como juego activo"
                              >
                                <FontAwesomeIcon icon={faCog} />
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
                  <div className="text-6xl text-gray-300 mb-4">🎮</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No hay juegos creados
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Crea tu primer juego para comenzar
                  </p>
                  <button
                    onClick={() => setShowGameForm(true)}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Crear Primer Juego
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Tabla de asignaciones */}
        {(viewMode === 'assignments' || viewMode === 'search') && (
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800">
                {viewMode === 'assignments' 
                  ? `Asignaciones - Sorteo ${currentRaffle}` 
                  : `Resultados de búsqueda (${filteredAssignments.length})`
                }
              </h2>
            </div>

          {currentAssignments.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cartón
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Participante
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contacto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sorteo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentAssignments.map((assignment) => (
                      <tr key={assignment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">
                              #{assignment.cardNumber}
                            </div>
                            <Link
                              to={`/bingo/carton/${assignment.cardNumber}`}
                              className="ml-2 text-purple-600 hover:text-purple-800"
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </Link>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {assignment.firstName} {assignment.lastName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{assignment.phone}</div>
                          <div className="text-sm text-gray-500">{assignment.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              assignment.paid 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {assignment.paid ? 'Pagado' : 'Pendiente'}
                            </span>
                            {assignment.winner && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gold-100 text-gold-800">
                                <FontAwesomeIcon icon={faTrophy} className="mr-1" />
                                Ganador
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {assignment.raffleId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(assignment)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              onClick={() => updateAssignment(assignment.id, { paid: !assignment.paid })}
                              className={assignment.paid ? "text-yellow-600 hover:text-yellow-900" : "text-green-600 hover:text-green-900"}
                            >
                              <FontAwesomeIcon icon={assignment.paid ? faTimes : faCheck} />
                            </button>
                            {!assignment.winner && (
                              <button
                                onClick={() => markAsWinner(assignment.id)}
                                className="text-yellow-600 hover:text-yellow-900"
                              >
                                <FontAwesomeIcon icon={faTrophy} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(assignment.id)}
                              className="text-red-600 hover:text-red-900"
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

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="px-6 py-3 border-t border-gray-200 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredAssignments.length)} de {filteredAssignments.length} asignaciones
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                    >
                      Anterior
                    </button>
                    <span className="px-3 py-1">
                      {currentPage} de {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl text-gray-300 mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {viewMode === 'search' ? 'No se encontraron resultados' : 'No hay asignaciones'}
              </h3>
              <p className="text-gray-500">
                {viewMode === 'search' 
                  ? 'Intenta con otros términos de búsqueda'
                  : 'Comienza asignando cartones a los participantes'
                }
              </p>
            </div>
          )}
        </div>
        )}
      </div>

      {/* Modal de formulario para asignaciones */}
      {showForm && (
        <AssignmentForm
          assignment={editingAssignment}
          isCardAssigned={isCardAssigned}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingAssignment(null);
          }}
        />
      )}

      {/* Modal para crear juego */}
      {showGameForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Crear Nuevo Juego</h3>
            <input
              type="text"
              placeholder="Nombre del juego"
              value={newGameName}
              onChange={(e) => setNewGameName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:outline-none mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={handleCreateGame}
                disabled={!newGameName.trim()}
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-3 rounded-lg transition-colors"
              >
                Crear Juego
              </button>
              <button
                onClick={() => {
                  setShowGameForm(false);
                  setNewGameName('');
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BingoAdmin;