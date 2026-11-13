import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedUserRoute = ({ children }) => {
  const { autenticado, cargando } = useAuth();

  if (cargando) {
    return (
      <main className="holder">
        <p>Verificando sesión...</p>
      </main>
    );
  }

  if (!autenticado) {
    return <Navigate to="/login-usuario" replace />;
  }

  return children;
};

export default ProtectedUserRoute;
