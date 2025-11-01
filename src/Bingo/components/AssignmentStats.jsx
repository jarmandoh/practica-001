import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTicketAlt, 
  faCheckCircle, 
  faExclamationCircle, 
  faTrophy,
  faBoxOpen
} from '@fortawesome/free-solid-svg-icons';

const AssignmentStats = ({ stats, currentRaffle }) => {
  const percentage = stats.total > 0 ? ((stats.total / 1200) * 100).toFixed(1) : 0;
  const paidPercentage = stats.total > 0 ? ((stats.paid / stats.total) * 100).toFixed(1) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {/* Total Asignados */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Asignados</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-500">{percentage}% de 1200</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <FontAwesomeIcon icon={faTicketAlt} className="text-2xl text-blue-600" />
          </div>
        </div>
        <div className="mt-4 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Pagados */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Pagados</p>
            <p className="text-3xl font-bold text-green-600">{stats.paid}</p>
            <p className="text-sm text-gray-500">{paidPercentage}% del total</p>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <FontAwesomeIcon icon={faCheckCircle} className="text-2xl text-green-600" />
          </div>
        </div>
        <div className="mt-4 bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${paidPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Pendientes */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Pendientes</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.unpaid}</p>
            <p className="text-sm text-gray-500">Sin pagar</p>
          </div>
          <div className="bg-yellow-100 p-3 rounded-full">
            <FontAwesomeIcon icon={faExclamationCircle} className="text-2xl text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Ganadores */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Ganadores</p>
            <p className="text-3xl font-bold text-orange-600">{stats.winners}</p>
            <p className="text-sm text-gray-500">Sorteo {currentRaffle}</p>
          </div>
          <div className="bg-orange-100 p-3 rounded-full">
            <FontAwesomeIcon icon={faTrophy} className="text-2xl text-orange-600" />
          </div>
        </div>
      </div>

      {/* Disponibles */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Disponibles</p>
            <p className="text-3xl font-bold text-gray-600">{stats.available}</p>
            <p className="text-sm text-gray-500">Sin asignar</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-full">
            <FontAwesomeIcon icon={faBoxOpen} className="text-2xl text-gray-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentStats;