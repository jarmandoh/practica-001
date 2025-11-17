import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faSignOutAlt, 
  faUser, 
  faGamepad,
  faTrophy,
  faPlay,
  faPause,
  faClock,
  faUsers,
  faCheckCircle,
  faPlus,
  faEdit,
  faTrash,
  faTimes,
  faSearch,
  faChartBar
} from '@fortawesome/free-solid-svg-icons';
import { useGestorAuth } from '../hooks/useGestorAuth';
import { useGameManager } from '../hooks/useGameManager';
import { useBingoAdmin } from '../hooks/useBingoAdmin';
import { SocketProvider } from '../context/SocketContext';
import NumberDisplay from '../components/NumberDisplay';
import BingoControls from '../components/BingoControls';
import AssignmentForm from '../components/AssignmentForm';
import AssignmentStats from '../components/AssignmentStats';
import GameStats from '../components/GameStats';


const BingoGestor = () => {
  const { gestor, logoutGestor, getTimeUntilExpiry } = useGestorAuth();
  const { getGameById, updateGame, addCalledNumber } = useGameManager();
  const {
    assignCard,
    updateAssignment,
    removeAssignment,
    getAssignmentsByRaffle
  } = useBingoAdmin();

  const [currentGame, setCurrentGame] = useState(null);
  const [gameStats, setGameStats] = useState({
    totalCards: 0,
    activeCards: 0,
    winners: 0
  });

  // Estados para manejo de asignaciones
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [viewMode, setViewMode] = useState('game');
  const [searchQuery, setSearchQuery] = useState('');
  const [showParticipantNames, setShowParticipantNames] = useState(false);

  // El sorteo actual se obtiene del juego actual del gestor
  const currentRaffle = currentGame?.currentRaffle || 1;

  // Variables derivadas
  const assignments = getAssignmentsByRaffle(currentRaffle);
  console.log('Asignaciones para sorteo', currentRaffle, ':', assignments);
  const filteredAssignments = assignments; // ya están filtrados por sorteo
  const searchResults = searchQuery 
    ? assignments.filter(a => 
        a.participantName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  const assignedCards = assignments.reduce((acc, assignment) => {
    for (let i = assignment.startCard; i <= assignment.endCard; i++) {
      acc.add(i);
    }
    return acc;
  }, new Set());
  
  // Calcular cartones totales asignados para el sorteo actual
  const totalCardsAssigned = assignments.reduce((total, assignment) => {
    const startCard = parseInt(assignment.startCard) || 0;
    const endCard = parseInt(assignment.endCard) || 0;
    const quantity = assignment.quantity || 0;
    
    if (quantity > 0) {
      return total + quantity;
    } else if (startCard > 0 && endCard > 0 && endCard >= startCard) {
      return total + (endCard - startCard + 1);
    } else {
      return total + 1;
    }
  }, 0) || 0;
  
  // Verificar si se ha alcanzado el límite de cartones
  const maxCards = currentGame?.maxPlayers || 1200;
  const isCardLimitReached = totalCardsAssigned >= maxCards;
  
  // Generar lista de participantes a partir de las asignaciones
  const participants = assignments.flatMap(assignment => {
    const cards = [];
    for (let i = assignment.startCard; i <= assignment.endCard; i++) {
      cards.push({
        id: `${assignment.id}-${i}`,
        assignmentId: assignment.id,
        participantName: assignment.participantName,
        cardNumber: i,
        paid: assignment.paid || false,
        winner: assignment.winner || false
      });
    }
    return cards;
  }).filter(participant => showParticipantNames || participant.paid);

  useEffect(() => {
    if (gestor?.gameId) {
      const game = getGameById(gestor.gameId);
      setCurrentGame(game);
      
      // Actualizar estadísticas cuando cambie el juego o el sorteo
      if (game) {
        const currentRaffleNumber = game.currentRaffle || 1;
        const assignments = getAssignmentsByRaffle(currentRaffleNumber);
        const totalCardsGenerated = assignments.reduce((total, assignment) => {
          // Validar que las propiedades existan y sean números válidos
          const startCard = parseInt(assignment.startCard) || 0;
          const endCard = parseInt(assignment.endCard) || 0;
          const quantity = assignment.quantity || 0;
          
          // Si tiene quantity definido, usarlo; sino calcular del rango
          if (quantity > 0) {
            return total + quantity;
          } else if (startCard > 0 && endCard > 0 && endCard >= startCard) {
            return total + (endCard - startCard + 1);
          } else {
            return total + 1; // Al menos contar 1 cartón por asignación
          }
        }, 0) || 0;
        
        setGameStats({
          totalCards: totalCardsGenerated,
          activeCards: assignments.filter(a => a.paid).length,
          winners: assignments.filter(a => a.winner).length
        });
      }
    }
  }, [gestor, getGameById, getAssignmentsByRaffle]);

  // Efecto separado para actualizar estadísticas cuando cambie el sorteo actual
  useEffect(() => {
    if (currentGame) {
      const assignments = getAssignmentsByRaffle(currentRaffle);
      const totalCardsGenerated = assignments.reduce((total, assignment) => {
        // Validar que las propiedades existan y sean números válidos
        const startCard = parseInt(assignment.startCard) || 0;
        const endCard = parseInt(assignment.endCard) || 0;
        const quantity = assignment.quantity || 0;
        
        // Si tiene quantity definido, usarlo; sino calcular del rango
        if (quantity > 0) {
          return total + quantity;
        } else if (startCard > 0 && endCard > 0 && endCard >= startCard) {
          return total + (endCard - startCard + 1);
        } else {
          return total + 1; // Al menos contar 1 cartón por asignación
        }
      }, 0) || 0;
      
      setGameStats({
        totalCards: totalCardsGenerated,
        activeCards: assignments.filter(a => a.paid).length,
        winners: assignments.filter(a => a.winner).length
      });
    }
  }, [currentRaffle, getAssignmentsByRaffle, currentGame]);

  const updateGameStats = () => {
    const assignments = getAssignmentsByRaffle(currentRaffle);
    const totalCardsGenerated = assignments.reduce((total, assignment) => {
      // Validar que las propiedades existan y sean números válidos
      const startCard = parseInt(assignment.startCard) || 0;
      const endCard = parseInt(assignment.endCard) || 0;
      const quantity = assignment.quantity || 0;
      
      // Si tiene quantity definido, usarlo; sino calcular del rango
      if (quantity > 0) {
        return total + quantity;
      } else if (startCard > 0 && endCard > 0 && endCard >= startCard) {
        return total + (endCard - startCard + 1);
      } else {
        return total + 1; // Al menos contar 1 cartón por asignación
      }
    }, 0) || 0;
    
    setGameStats({
      totalCards: totalCardsGenerated,
      activeCards: assignments.filter(a => a.paid).length,
      winners: assignments.filter(a => a.winner).length
    });
  };

  // Funciones de manejo de asignaciones
  const handleFormSubmit = (formData) => {
    if (editingAssignment) {
      updateAssignment(editingAssignment.id, formData);
      setEditingAssignment(null);
    } else {
      assignCard(formData);
    }
    setShowForm(false);
    updateGameStats();
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta asignación?')) {
      removeAssignment(id);
      updateGameStats();
    }
  };

  const handleCallNumber = (number) => {
    if (currentGame) {
      addCalledNumber(currentGame.id, number);
      // Actualizar el juego local
      const updatedGame = getGameById(currentGame.id);
      setCurrentGame(updatedGame);
    }
  };

  const handleMarkWinner = (participantId, assignmentId) => {
    const assignments = JSON.parse(localStorage.getItem('bingoAssignments') || '[]');
    const updatedAssignments = assignments.map(a => 
      a.id === assignmentId ? { ...a, winner: true } : a
    );
    localStorage.setItem('bingoAssignments', JSON.stringify(updatedAssignments));
    
    updateGameStats();
  };

  const handleTogglePaid = (assignmentId) => {
    const assignments = JSON.parse(localStorage.getItem('bingoAssignments') || '[]');
    const updatedAssignments = assignments.map(a => 
      a.id === assignmentId ? { ...a, paid: !a.paid } : a
    );
    localStorage.setItem('bingoAssignments', JSON.stringify(updatedAssignments));
    
    updateGameStats();
  };

  const handlePauseGame = () => {
    if (currentGame) {
      updateGame(currentGame.id, { status: 'waiting' });
      setCurrentGame({ ...currentGame, status: 'waiting' });
    }
  };

  const handleResumeGame = () => {
    if (currentGame) {
      updateGame(currentGame.id, { status: 'active' });
      setCurrentGame({ ...currentGame, status: 'active' });
    }
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      logoutGestor();
    }
  };

  const timeLeft = getTimeUntilExpiry();

  if (!currentGame) {
    return (
      <SocketProvider>
        <div className="min-h-screen bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md">
            <FontAwesomeIcon icon={faGamepad} className="text-6xl text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Juego No Disponible</h2>
            <p className="text-gray-600 mb-6">
              El juego asignado no está disponible o ha sido eliminado.
            </p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg transition-colors"
            >
              Volver al Login
            </button>
          </div>
        </div>
      </SocketProvider>
    );
  }

  return (
    <SocketProvider>
      <div className="min-h-screen bg-linear-to-br from-blue-600 to-indigo-700 p-4">
        {/* Number Display sticky */}
        <div className="fixed top-4 left-4 z-50">
          <NumberDisplay 
            currentNumber={currentGame?.currentNumber}
            calledNumbers={currentGame?.calledNumbers || []}
          />
        </div>

        <div className="max-w-7xl mx-auto ml-72">
          {/* Header */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Gestor de Sorteos - {currentGame.name}
                </h1>
                <div className="flex items-center space-x-4 text-blue-100">
                  <span className="flex items-center">
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    {gestor.name}
                  </span>
                  <span className="flex items-center">
                    <FontAwesomeIcon icon={faGamepad} className="mr-2" />
                    Juego ID: {gestor.gameId}
                  </span>
                  <span className={`flex items-center px-3 py-1 rounded-full text-sm ${
                    currentGame.status === 'active' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-yellow-500 text-white'
                  }`}>
                    {currentGame.status === 'active' ? 'Activo' : 'En Pausa'}
                  </span>
                  {timeLeft.valid && (
                    <span className="flex items-center text-sm">
                      <FontAwesomeIcon icon={faClock} className="mr-1" />
                      {timeLeft.hours}h {timeLeft.minutes}m
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <Link 
                  to="/bingo" 
                  className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition duration-300 inline-flex items-center"
                >
                  <FontAwesomeIcon icon={faHome} className="mr-2" />
                  Inicio
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-300 inline-flex items-center"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  Salir
                </button>
              </div>
            </div>
          </div>

          {/* Estadísticas del Juego */}
          <GameStats 
            assignments={assignments}
            gameStats={gameStats}
            currentRaffle={currentRaffle}
            calledNumbers={currentGame.calledNumbers || []}
            maxNumbers={75}
          />

          {/* Controles de vista */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <div className="flex gap-4 items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('game')}
                  className={`px-4 py-2 rounded-lg transition duration-300 ${
                    viewMode === 'game' 
                      ? 'bg-white text-blue-600 font-semibold' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <FontAwesomeIcon icon={faGamepad} className="mr-2" />
                  Control del Juego
                </button>
                <button
                  onClick={() => {
                    setViewMode('assignments');
                  }}
                  className={`px-4 py-2 rounded-lg transition duration-300 ${
                    viewMode === 'assignments' 
                      ? 'bg-white text-blue-600 font-semibold' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <FontAwesomeIcon icon={faChartBar} className="mr-2" />
                  Gestión de Cartones
                </button>
                <button
                  onClick={() => setViewMode('search')}
                  className={`px-4 py-2 rounded-lg transition duration-300 ${
                    viewMode === 'search' 
                      ? 'bg-white text-blue-600 font-semibold' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <FontAwesomeIcon icon={faSearch} className="mr-2" />
                  Búsqueda
                </button>
              </div>

              {viewMode === 'assignments' && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-white font-medium">Sorteo Actual:</label>
                    <span className="px-3 py-2 bg-white/20 text-white rounded-lg font-semibold">
                      Sorteo {currentRaffle}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowForm(true)}
                    className={`px-4 py-2 rounded-lg transition duration-300 inline-flex items-center ${
                      isCardLimitReached
                        ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                    disabled={isCardLimitReached}
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Nueva Asignación
                  </button>
                  <button
                    onClick={() => {
                      // Crear asignación de prueba
                      const testAssignment = {
                        id: Date.now().toString(),
                        participantName: `Participante Prueba ${Math.floor(Math.random() * 100)}`,
                        startCard: Math.floor(Math.random() * 50) + 1,
                        endCard: Math.floor(Math.random() * 50) + 51,
                        quantity: 10,
                        paid: Math.random() > 0.5,
                        raffleNumber: currentRaffle,
                        createdAt: new Date().toISOString()
                      };
                      testAssignment.quantity = testAssignment.endCard - testAssignment.startCard + 1;
                      assignCard(testAssignment);
                      updateGameStats();
                    }}
                    disabled={isCardLimitReached}
                    className={`px-4 py-2 rounded-lg transition duration-300 inline-flex items-center ${
                      isCardLimitReached
                        ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                    title={isCardLimitReached ? `Límite de cartones alcanzado (${maxCards})` : 'Crear asignación de prueba'}
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Prueba
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Controles del Juego */}
          {viewMode === 'game' && (
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Controles de Números */}
            <div className="bg-white rounded-xl shadow-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Control del Sorteo</h2>
                <div className="flex gap-2">
                  {currentGame.status === 'active' ? (
                    <button
                      onClick={handlePauseGame}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <FontAwesomeIcon icon={faPause} className="mr-2" />
                      Pausar
                    </button>
                  ) : (
                    <button
                      onClick={handleResumeGame}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <FontAwesomeIcon icon={faPlay} className="mr-2" />
                      Reanudar
                    </button>
                  )}
                </div>
              </div>
              {currentGame.status === 'active' && (
                <BingoControls 
                  onCallNumber={handleCallNumber}
                  calledNumbers={currentGame.calledNumbers || []}
                />
              )}
              {currentGame.status === 'waiting' && (
                <div className="text-center py-8">
                  <FontAwesomeIcon icon={faPause} className="text-6xl text-gray-300 mb-4" />
                  <p className="text-gray-500">El sorteo está pausado</p>
                  <p className="text-sm text-gray-400">Haz clic en "Reanudar" para continuar</p>
                </div>
              )}
            </div>

            {/* Lista de Participantes */}
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Participantes ({participants.length})
                  </h2>
                  <button
                    onClick={() => setShowParticipantNames(!showParticipantNames)}
                    className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                      showParticipantNames 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    {showParticipantNames ? 'Ocultar Nombres' : 'Mostrar Nombres'}
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {showParticipantNames 
                    ? 'Mostrando todos los participantes'
                    : 'Mostrando solo participantes con cartones pagados'
                  }
                </p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {participants.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {participants.map((participant) => (
                      <div key={participant.id} className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">
                              {showParticipantNames 
                                ? participant.participantName 
                                : `Participante #${participant.cardNumber}`
                              }
                            </p>
                            <p className="text-sm text-gray-500">
                              Cartón #{participant.cardNumber}
                              {participant.paid && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                                  Pagado
                                </span>
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {participant.winner ? (
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                                <FontAwesomeIcon icon={faTrophy} className="mr-1" />
                                Ganador
                              </span>
                            ) : (
                              <button
                                onClick={() => handleMarkWinner(participant.id, participant.assignmentId)}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full text-xs transition-colors"
                              >
                                <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                                Marcar Ganador
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FontAwesomeIcon icon={faUsers} className="text-6xl text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      {showParticipantNames 
                        ? 'No hay participantes registrados'
                        : 'No hay participantes con cartones pagados'
                      }
                    </h3>
                    <p className="text-gray-500">
                      {showParticipantNames 
                        ? 'Los participantes aparecerán aquí cuando se asignen cartones'
                        : 'Marca cartones como pagados en la gestión de asignaciones'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          )}

          {/* Vista de Gestión de Asignaciones */}
          {viewMode === 'assignments' && (
            <div className="space-y-6">
              {/* Estadísticas de Asignaciones */}
              <AssignmentStats 
                assignments={filteredAssignments}
                currentRaffle={currentRaffle}
                maxCards={currentGame?.maxPlayers || 1200}
              />

              {/* Lista de Asignaciones */}
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Asignaciones del Sorteo {currentRaffle} ({filteredAssignments.length} total)
                  </h2>
                  {filteredAssignments.length === 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      No hay asignaciones para este sorteo. Haz clic en "Nueva Asignación" para crear una.
                    </p>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Participante
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cartones
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAssignments.length > 0 ? (
                        filteredAssignments.map((assignment) => (
                          <tr key={assignment.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {assignment.participantName || 'Sin nombre'}
                              </div>
                              <div className="text-xs text-gray-500">
                                ID: {assignment.id} | Sorteo: {assignment.raffleNumber}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {assignment.startCard} - {assignment.endCard}
                                <span className="text-gray-500 ml-2">
                                  ({assignment.quantity} cartones)
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  assignment.paid 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  <FontAwesomeIcon 
                                    icon={assignment.paid ? faCheckCircle : faTimes} 
                                    className="mr-1" 
                                  />
                                  {assignment.paid ? 'Pagado' : 'Pendiente'}
                                </span>
                                <button
                                  onClick={() => handleTogglePaid(assignment.id)}
                                  className={`px-2 py-1 rounded text-xs transition-colors ${
                                    assignment.paid
                                      ? 'bg-red-100 hover:bg-red-200 text-red-700'
                                      : 'bg-green-100 hover:bg-green-200 text-green-700'
                                  }`}
                                  title={assignment.paid ? 'Marcar como pendiente' : 'Marcar como pagado'}
                                >
                                  {assignment.paid ? 'Desmarcar' : 'Marcar Pagado'}
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(assignment.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleEdit(assignment)}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                              <button
                                onClick={() => handleDelete(assignment.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                            No hay asignaciones para este sorteo
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Vista de Búsqueda */}
          {viewMode === 'search' && (
            <div className="bg-white rounded-xl shadow-2xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Búsqueda de Cartones
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar por nombre de participante:
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Nombre del participante..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                {searchResults.length > 0 && (
                  <div className="border border-gray-200 rounded-lg">
                    <div className="p-3 bg-gray-50 border-b border-gray-200">
                      <h3 className="font-medium text-gray-900">
                        Resultados de búsqueda ({searchResults.length})
                      </h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {searchResults.map((assignment) => (
                        <div key={assignment.id} className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-900">
                                {assignment.participantName}
                              </p>
                              <p className="text-sm text-gray-500">
                                Sorteo {assignment.raffleNumber} - Cartones {assignment.startCard} al {assignment.endCard}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(assignment)}
                                className="text-orange-600 hover:text-orange-900"
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                              <button
                                onClick={() => handleDelete(assignment.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Formulario de Asignación */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-gray-800">
                      {editingAssignment ? 'Editar Asignación' : 'Nueva Asignación'}
                    </h2>
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setEditingAssignment(null);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FontAwesomeIcon icon={faTimes} className="text-xl" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <AssignmentForm
                    assignment={editingAssignment}
                    isCardAssigned={(cardNumber) => assignedCards.has(cardNumber)}
                    onSubmit={handleFormSubmit}
                    onClose={() => {
                      setShowForm(false);
                      setEditingAssignment(null);
                    }}
                    currentRaffle={currentRaffle}
                    maxCards={currentGame?.maxPlayers || 1200}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Instrucciones */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Instrucciones para el Gestor</h3>
            <div className="grid md:grid-cols-3 gap-6 text-orange-100">
              <div>
                <h4 className="font-semibold mb-2">Control de Números</h4>
                <ul className="text-sm space-y-1">
                  <li>• Usa los controles para cantar números</li>
                  <li>• Los números se muestran automáticamente</li>
                  <li>• Puedes pausar y reanudar el sorteo</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Gestión de Participantes</h4>
                <ul className="text-sm space-y-1">
                  <li>• Ve la lista de todos los participantes</li>
                  <li>• Marca ganadores cuando hagan BINGO</li>
                  <li>• Revisa el estado de cada cartón</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Estadísticas</h4>
                <ul className="text-sm space-y-1">
                  <li>• Monitorea el progreso del sorteo</li>
                  <li>• Ve estadísticas en tiempo real</li>
                  <li>• Controla el flujo del juego</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SocketProvider>
  );
};

export default BingoGestor;