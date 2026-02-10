# Sistema de Reservas de Canchas Sintéticas

Sistema completo para la gestión de reservas de canchas de fútbol sintético (Fútbol 5, 8 y 11).

## Características

### Landing Page
- Banner principal con información del negocio
- Sección de video de presentación
- Listado de canchas disponibles con detalles
- Formulario de reserva en 3 pasos:
  1. Selección de cancha
  2. Selección de fecha y horario
  3. Datos del cliente
- Información de tarifas por horario
- Sección de contacto con formulario

### Panel de Administración
- Dashboard con estadísticas en tiempo real
- Gestión completa de canchas (CRUD)
- Configuración de horarios de funcionamiento por día
- Configuración de precios por franja horaria
- Gestión de reservas (confirmar, cancelar, completar)
- Configuración del negocio

## Estructura de Archivos

```
src/Reservas/
├── index.js                    # Exportaciones principales
├── README.md                   # Este archivo
├── components/
│   ├── AdminLogin/            # Login para administradores
│   ├── Banner/                # Banner principal de la landing
│   ├── CourtCard/             # Tarjeta de cancha individual
│   ├── ReservationForm/       # Formulario de reserva
│   ├── ReservationSuccessModal/ # Modal de confirmación exitosa
│   ├── TimeSlotPicker/        # Selector de horarios
│   └── VideoSection/          # Sección de video
├── context/
│   └── ReservasContext.jsx    # Context global del módulo
├── data/
│   ├── courtsConfig.js        # Configuración de canchas y utilidades
│   └── database_schema.sql    # Schema de base de datos MySQL
└── pages/
    ├── ReservasLanding.jsx    # Página principal/landing
    ├── ReservasAdmin.jsx      # Panel de administración
    └── ProtectedReservasAdmin.jsx # Admin protegido con login
```

## Uso

### Importar en App.jsx

```jsx
import { ReservasProvider, ReservasLanding, ProtectedReservasAdmin } from './Reservas';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <ReservasProvider>
        <Routes>
          <Route path="/reservas" element={<ReservasLanding />} />
          <Route path="/reservas/admin" element={<ProtectedReservasAdmin />} />
        </Routes>
      </ReservasProvider>
    </BrowserRouter>
  );
}
```

## Tipos de Canchas

| Tipo | Jugadores | Dimensiones | Precio Base |
|------|-----------|-------------|-------------|
| Fútbol 5 | 5 vs 5 | 25m x 15m | $80,000 |
| Fútbol 8 | 8 vs 8 | 50m x 30m | $120,000 |
| Fútbol 11 | 11 vs 11 | 100m x 65m | $180,000 |

## Tarifas por Horario

| Franja | Horario | Multiplicador |
|--------|---------|---------------|
| Mañana | 6:00 - 12:00 | 0.8x (20% descuento) |
| Tarde | 12:00 - 18:00 | 1.0x (precio normal) |
| Noche | 18:00 - 23:00 | 1.2x (20% recargo) |

## Base de Datos

El archivo `database_schema.sql` contiene el schema completo para MySQL con:

- Tablas para administradores, canchas, reservas, clientes, pagos
- Procedimientos almacenados para disponibilidad y creación de reservas
- Vistas para reportes
- Triggers para auditoría
- Datos de ejemplo

Para implementar con un backend real:
1. Ejecutar el schema SQL en MySQL
2. Crear API REST para conectar con el frontend
3. Reemplazar el localStorage por llamadas a la API

## Credenciales de Demo

- **Usuario:** admin
- **Contraseña:** admin123

## Características Técnicas

- React Context API para estado global
- LocalStorage para persistencia de datos (demo)
- Diseño responsive con Tailwind CSS
- Soporte para modo oscuro
- Validación de formularios
- Animaciones y transiciones suaves
