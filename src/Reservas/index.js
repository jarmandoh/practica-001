// Reservas Module - Court Reservation System
// Export all pages and components

// Context
export { ReservasProvider, useReservas } from './context/ReservasContext';

// Pages
export { default as ReservasLanding } from './pages/ReservasLanding';
export { default as ReservasAdmin } from './pages/ReservasAdmin';
export { default as ReservasCanchas } from './pages/ReservasCanchas';
export { default as ReservasCrear } from './pages/ReservasCrear';
export { default as ProtectedReservasAdmin } from './pages/ProtectedReservasAdmin';

// Components
export { default as Banner } from './components/Banner';
export { default as VideoSection } from './components/VideoSection';
export { default as CourtCard } from './components/CourtCard';
export { default as TimeSlotPicker } from './components/TimeSlotPicker';
export { default as ReservationForm } from './components/ReservationForm';
export { default as ReservationSuccessModal } from './components/ReservationSuccessModal';
export { default as AdminLogin } from './components/AdminLogin';

// Data exports
export * from './data/courtsConfig';
