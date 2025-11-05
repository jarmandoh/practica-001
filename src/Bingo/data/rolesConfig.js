import { 
  faUserShield, 
  faGamepad, 
  faListOl,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';

export const rolesConfig = [
  {
    id: 'admin',
    icon: faUserShield,
    title: 'Administrador',
    subtitle: 'Control total del sistema',
    description: null,
    features: [
      'Crear y gestionar juegos/sorteos',
      'Controlar números cantados en tiempo real',
      'Asignar cartones a participantes',
      'Gestionar pagos y ganadores',
      'Estadísticas detalladas'
    ],
    buttonText: 'Acceder',
    buttonIcon: faChartLine,
    route: '/bingo/admin',
    colors: {
      gradient: 'from-purple-700 to-purple-900',
      subtitle: 'text-purple-200',
      dot: 'bg-purple-500',
      button: 'bg-purple-600',
      buttonHover: 'bg-purple-700'
    },
    footerText: 'Requiere contraseña de administrador'
  },
  {
    id: 'gestor',
    icon: faListOl,
    title: 'Gestor de Sorteos',
    subtitle: 'Control específico del sorteo',
    description: null,
    features: [
      'Cantar números del sorteo',
      'Controlar flujo del juego',
      'Ver cartones participantes',
      'Marcar ganadores del sorteo',
      'Acceso con contraseña única'
    ],
    buttonText: 'Acceder',
    buttonIcon: faListOl,
    route: '/bingo/gestor',
    colors: {
      gradient: 'from-orange-600 to-red-600',
      subtitle: 'text-orange-100',
      dot: 'bg-orange-500',
      button: 'bg-orange-600',
      buttonHover: 'bg-orange-700'
    },
    footerText: 'Contraseña generada por el administrador'
  },
  {
    id: 'player',
    icon: faGamepad,
    title: 'Jugador',
    subtitle: 'Experiencia de juego completa',
    description: null,
    features: [
      'Unirse a juegos por ID único',
      'Ver tu cartón en tiempo real',
      'Seguir números cantados',
      'Notificaciones de BINGO automáticas',
      'Interfaz optimizada para móviles'
    ],
    buttonText: 'Acceder',
    buttonIcon: faGamepad,
    route: '/bingo/player',
    colors: {
      gradient: 'from-green-600 to-blue-600',
      subtitle: 'text-green-100',
      dot: 'bg-green-500',
      button: 'bg-green-600',
      buttonHover: 'bg-green-700'
    },
    footerText: 'Ingresa con tu nombre y ID del juego'
  }
];