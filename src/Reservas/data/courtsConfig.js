// Configuración de tipos de canchas y valores por defecto
export const COURT_TYPES = {
  FUTBOL_5: {
    id: 'futbol_5',
    name: 'Fútbol 5',
    description: 'Cancha sintética para 5 jugadores por equipo',
    playersPerTeam: 5,
    dimensions: '25m x 15m',
    defaultPrice: 80000,
    icon: '⚽'
  },
  FUTBOL_8: {
    id: 'futbol_8',
    name: 'Fútbol 8',
    description: 'Cancha sintética para 8 jugadores por equipo',
    playersPerTeam: 8,
    dimensions: '50m x 30m',
    defaultPrice: 120000,
    icon: '⚽'
  },
  FUTBOL_11: {
    id: 'futbol_11',
    name: 'Fútbol 11',
    description: 'Cancha sintética profesional para 11 jugadores por equipo',
    playersPerTeam: 11,
    dimensions: '100m x 65m',
    defaultPrice: 180000,
    icon: '🏟️'
  }
};

// Horarios de funcionamiento por defecto
export const DEFAULT_OPERATING_HOURS = {
  openTime: '06:00',
  closeTime: '23:00',
  slotDuration: 60 // minutos
};

// Días de la semana
export const DAYS_OF_WEEK = [
  { id: 0, name: 'Domingo', shortName: 'Dom' },
  { id: 1, name: 'Lunes', shortName: 'Lun' },
  { id: 2, name: 'Martes', shortName: 'Mar' },
  { id: 3, name: 'Miércoles', shortName: 'Mié' },
  { id: 4, name: 'Jueves', shortName: 'Jue' },
  { id: 5, name: 'Viernes', shortName: 'Vie' },
  { id: 6, name: 'Sábado', shortName: 'Sáb' }
];

// Franjas horarias con precios diferenciados
export const TIME_SLOT_CATEGORIES = {
  MORNING: {
    id: 'morning',
    name: 'Mañana',
    startTime: '06:00',
    endTime: '12:00',
    priceMultiplier: 0.8 // 20% descuento
  },
  AFTERNOON: {
    id: 'afternoon',
    name: 'Tarde',
    startTime: '12:00',
    endTime: '18:00',
    priceMultiplier: 1.0 // Precio normal
  },
  NIGHT: {
    id: 'night',
    name: 'Noche',
    startTime: '18:00',
    endTime: '23:00',
    priceMultiplier: 1.2 // 20% más caro
  }
};

// Estados de reserva
export const RESERVATION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
};

// Datos de ejemplo de canchas (se cargarían de la DB)
export const SAMPLE_COURTS = [
  {
    id: 1,
    name: 'Cancha Principal',
    type: 'futbol_5',
    description: 'Nuestra cancha estrella con césped sintético de última generación, iluminación LED profesional y graderías.',
    amenities: ['Iluminación LED', 'Graderías', 'Vestuarios', 'Parqueadero'],
    images: [],
    isActive: true
  },
  {
    id: 2,
    name: 'Cancha Norte',
    type: 'futbol_5',
    description: 'Cancha ideal para partidos casuales y entrenamientos.',
    amenities: ['Iluminación', 'Vestuarios'],
    images: [],
    isActive: true
  },
  {
    id: 3,
    name: 'Cancha Profesional',
    type: 'futbol_8',
    description: 'Cancha de mayor tamaño perfecta para partidos competitivos.',
    amenities: ['Iluminación LED', 'Graderías', 'Vestuarios', 'Cafetería', 'Parqueadero'],
    images: [],
    isActive: true
  },
  {
    id: 4,
    name: 'Estadio Central',
    type: 'futbol_11',
    description: 'Cancha profesional tamaño completo para torneos y eventos especiales.',
    amenities: ['Iluminación LED Pro', 'Graderías cubiertas', 'Vestuarios premium', 'Cafetería', 'Parqueadero VIP', 'Sistema de sonido'],
    images: [],
    isActive: true
  }
];

// Generar horarios disponibles
export const generateTimeSlots = (openTime, closeTime, duration = 60) => {
  const slots = [];
  const [openHour, openMinute] = openTime.split(':').map(Number);
  const [closeHour, closeMinute] = closeTime.split(':').map(Number);
  
  let currentHour = openHour;
  let currentMinute = openMinute;
  
  while (currentHour < closeHour || (currentHour === closeHour && currentMinute < closeMinute)) {
    const startTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
    
    // Calcular hora de fin
    let endMinute = currentMinute + duration;
    let endHour = currentHour;
    
    if (endMinute >= 60) {
      endHour += Math.floor(endMinute / 60);
      endMinute = endMinute % 60;
    }
    
    const endTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
    
    slots.push({
      startTime,
      endTime,
      label: `${startTime} - ${endTime}`
    });
    
    currentMinute += duration;
    if (currentMinute >= 60) {
      currentHour += Math.floor(currentMinute / 60);
      currentMinute = currentMinute % 60;
    }
  }
  
  return slots;
};

// Obtener categoría de franja horaria basada en la hora
export const getTimeSlotCategory = (time) => {
  const [hour] = time.split(':').map(Number);
  
  if (hour >= 6 && hour < 12) return TIME_SLOT_CATEGORIES.MORNING;
  if (hour >= 12 && hour < 18) return TIME_SLOT_CATEGORIES.AFTERNOON;
  return TIME_SLOT_CATEGORIES.NIGHT;
};

// Calcular precio para una franja horaria específica
export const calculateSlotPrice = (courtType, time) => {
  const court = COURT_TYPES[courtType.toUpperCase().replace('-', '_')];
  const category = getTimeSlotCategory(time);
  
  if (!court) return 0;
  
  return Math.round(court.defaultPrice * category.priceMultiplier);
};

// Formatear precio en moneda colombiana
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};
