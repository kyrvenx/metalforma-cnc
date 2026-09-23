import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/layout/Header';
import Nav from './components/layout/Nav';
import Footer from './components/layout/Footer';

import HomePage from './pages/HomePage';
import NosotrosPage from './pages/NosotrosPage';
import NovedadesPage from './pages/NovedadesPage';
import ContactoPage from './pages/ContactoPage';
import CarritoPage from './pages/CarritoPage';

import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

import RegistroPage from './pages/RegistroPage';
import LoginUsuarioPage from './pages/LoginUsuarioPage';

import { CarritoProvider } from './context/CarritoContext';

function App() {
  return (
    <BrowserRouter>
      <CarritoProvider>
        <div className="App">
          <Header />
          <Nav />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/nosotros" element={<NosotrosPage />} />
            <Route path="/novedades" element={<NovedadesPage />} />
            <Route path="/contacto" element={<ContactoPage />} />
            <Route path="/carrito" element={<CarritoPage />} />

            {/* Acceso administrativo */}
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Acceso de clientes */}
            <Route path="/registro" element={<RegistroPage />} />
            <Route
              path="/login-usuario"
              element={<LoginUsuarioPage />}
            />
          </Routes>

          <Footer />
        </div>
      </CarritoProvider>
    </BrowserRouter>
  );
}

export default App;
