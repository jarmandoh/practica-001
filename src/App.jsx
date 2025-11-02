import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Skills from './pages/Skills'
import Contact from './pages/Contact'
import { BingoMain, BingoCardViewer, BingoCardsList, ProtectedBingoAdmin } from './Bingo'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

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
                </Routes>
              </main>
              <Footer />
            </>
          } />
          
          {/* Rutas independientes de Bingo sin Navbar/Footer */}
          <Route path="/bingo" element={<BingoMain />} />
          <Route path="/bingo/admin" element={<ProtectedBingoAdmin />} />
          <Route path="/bingo/cartones" element={<BingoCardsList />} />
          <Route path="/bingo/carton/:cardId" element={<BingoCardViewer />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
