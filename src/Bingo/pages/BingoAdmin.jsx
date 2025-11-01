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
  faChartBar
} from '@fortawesome/free-solid-svg-icons';
import { useBingoAdmin } from '../hooks/useBingoAdmin';
import AssignmentForm from '../components/AssignmentForm';
import AssignmentStats from '../components/AssignmentStats';

const BingoAdmin = () => {
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

  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [viewMode, setViewMode] = useState('list'); // 'list' o 'search'

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

  const stats = getStats();

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-600 to-blue-600 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Administrador de Bingo</h1>
              <p className="text-purple-100">Gestiona las asignaciones de cartones y participantes</p>
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
            </div>
          </div>

          {/* Controles de vista */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg transition duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-white text-purple-600 font-semibold' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <FontAwesomeIcon icon={faChartBar} className="mr-2" />
                Listado por Sorteo
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

            {viewMode === 'list' && (
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

        {/* Estadísticas */}
        <AssignmentStats stats={stats} currentRaffle={currentRaffle} />

        {/* Tabla de asignaciones */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">
              {viewMode === 'list' 
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
      </div>

      {/* Modal de formulario */}
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
    </div>
  );
};

export default BingoAdmin;