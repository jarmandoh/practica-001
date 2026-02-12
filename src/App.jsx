import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Skills from './pages/Skills'
import Contact from './pages/Contact'
import PoliticaDatos from './pages/PoliticaDatos'
import { 
  BingoLanding, 
  BingoCardViewer, 
  BingoCardsList, 
  ProtectedBingoAdmin,
  ProtectedBingoPlayer,
  ProtectedBingoGestor
} from './Bingo';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { 
  FichasLanding, 
  ProtectedFichasAdmin, 
  ProtectedFichasGestor, 
  ProtectedFichasPlayer,
  FichasSocketProvider 
} from './Fichas'
import {
  ReservasProvider,
  ReservasLanding,
  ReservasCanchas,
  ReservasCrear,
  ProtectedReservasAdmin
} from './Reservas'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Routes>
          {/* Ruta principal con Navbar y Footer */}
          <Route path="/*" element={
            <>
              <Navbar />
              <main className="grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/proyectos" element={<Projects />} />
                  <Route path="/habilidades" element={<Skills />} />
                  <Route path="/contacto" element={<Contact />} />
                  <Route path="/politica" element={<PoliticaDatos />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
          
          {/* Rutas independientes de Bingo sin Navbar/Footer */}
          <Route path="/bingo" element={<BingoLanding />} />
          <Route path="/bingo/admin" element={<ProtectedBingoAdmin />} />
          <Route path="/bingo/gestor" element={<ProtectedBingoGestor />} />
          <Route path="/bingo/player" element={<ProtectedBingoPlayer />} />
          <Route path="/bingo/cartones" element={<BingoCardsList />} />
          <Route path="/bingo/carton/:cardId" element={<BingoCardViewer />} />
          
          {/* Rutas independientes del Juego del Siglo */}
          {/* <Route path="/siglo" element={<SigloGame />} />
          <Route path="/siglo/multijugador" element={<SigloMultiplayer />} /> */}
          {/* Rutas con vistas individuales por jugador */}
          {/* <Route path="/siglo/admin" element={<GameStateProvider><SigloAdmin /></GameStateProvider>} />
          <Route path="/siglo/seleccionar" element={<GameStateProvider><SigloPlayerSelect /></GameStateProvider>} />
          <Route path="/siglo/jugador/:playerId" element={<GameStateProvider><SigloPlayerView /></GameStateProvider>} /> */}
          
          {/* Rutas independientes del Juego de Fichas */}
          <Route path="/fichas" element={<FichasLanding />} />
          <Route path="/fichas/player" element={<FichasSocketProvider><ProtectedFichasPlayer /></FichasSocketProvider>} />
          <Route path="/fichas/admin" element={<FichasSocketProvider><ProtectedFichasAdmin /></FichasSocketProvider>} />
          <Route path="/fichas/gestor" element={<FichasSocketProvider><ProtectedFichasGestor /></FichasSocketProvider>} />
          
          {/* Rutas independientes del Sistema de Reservas de Canchas */}
          <Route path="/reservas" element={<ReservasProvider><ReservasLanding /></ReservasProvider>} />
          <Route path="/reservas/canchas" element={<ReservasProvider><ReservasCanchas /></ReservasProvider>} />
          <Route path="/reservas/reserva/crear" element={<ReservasProvider><ReservasCrear /></ReservasProvider>} />
          <Route path="/reservas/admin" element={<ReservasProvider><ProtectedReservasAdmin /></ReservasProvider>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
