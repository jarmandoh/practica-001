import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faEye } from '@fortawesome/free-solid-svg-icons';

const BingoCardsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    document.title = 'Lista de Cartones | Bingo';
  }, []);
  const cardsPerPage = 50;

  // Generar array de números de cartones
  const allCardNumbers = Array.from({ length: 1200 }, (_, i) => i + 1);

  // Filtrar cartones basado en la búsqueda
  const filteredCards = allCardNumbers.filter(cardNum => 
    cardNum.toString().includes(searchTerm)
  );

  // Paginación
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentCards = filteredCards.slice(startIndex, endIndex);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reiniciar a la primera página al buscar
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  // Generar números de páginas para mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-600 to-blue-600 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold text-white">Cartones de Bingo</h1>
            <Link 
              to="/bingo" 
              className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition duration-300 inline-flex items-center"
            >
              <FontAwesomeIcon icon={faHome} className="mr-2" />
              Juego Principal
            </Link>
          </div>
          
          <p className="text-purple-100 text-lg mb-4">
            Explora y visualiza cualquiera de los 1200 cartones únicos disponibles
          </p>

          {/* Buscador */}
          <div className="relative">
            <FontAwesomeIcon 
              icon={faSearch} 
              className="absolute left-3 top-3 text-gray-400" 
            />
            <input
              type="text"
              placeholder="Buscar cartón por número... (ej: 123)"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border-0 focus:ring-2 focus:ring-purple-300 focus:outline-none text-gray-700"
            />
          </div>
        </div>

        {/* Resultados */}
        <div className="bg-white rounded-xl shadow-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {searchTerm ? `Resultados para "${searchTerm}"` : 'Todos los Cartones'}
            </h2>
            <span className="text-gray-600">
              {filteredCards.length} cartones encontrados
            </span>
          </div>

          {/* Grid de cartones */}
          {currentCards.length > 0 ? (
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-12 2xl:grid-cols-12 gap-3 mb-6">
              {currentCards.map((cardNum) => (
                <Link
                  key={cardNum}
                  to={`/bingo/carton/${cardNum}`}
                  className="group"
                >
                  <div className="bg-linear-to-br from-purple-500 to-blue-500 text-white rounded-lg p-3 text-center hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                    <div className="text-sm font-bold mb-1">#{cardNum}</div>
                    <FontAwesomeIcon 
                      icon={faEye} 
                      className="text-xs opacity-70 group-hover:opacity-100" 
                    />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl text-gray-300 mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No se encontraron cartones
              </h3>
              <p className="text-gray-500">
                Intenta con un número diferente entre 1 y 1200
              </p>
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-500 text-white hover:bg-purple-600'
                } transition duration-300`}
              >
                Primera
              </button>

              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-500 text-white hover:bg-purple-600'
                } transition duration-300`}
              >
                ← Anterior
              </button>

              {getPageNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`px-3 py-2 rounded-lg transition duration-300 ${
                    currentPage === pageNum
                      ? 'bg-purple-600 text-white font-bold'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-lg ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-500 text-white hover:bg-purple-600'
                } transition duration-300`}
              >
                Siguiente →
              </button>

              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-lg ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-500 text-white hover:bg-purple-600'
                } transition duration-300`}
              >
                Última
              </button>
            </div>
          )}

          {/* Info de paginación */}
          {totalPages > 1 && (
            <div className="text-center mt-4 text-gray-600 text-sm">
              Página {currentPage} de {totalPages} | 
              Mostrando {startIndex + 1}-{Math.min(endIndex, filteredCards.length)} de {filteredCards.length} cartones
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BingoCardsList;