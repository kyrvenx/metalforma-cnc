import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [estado, setEstado] = useState('cargando');

  useEffect(() => {
    fetch('http://localhost:3001/api/admin/sesion', {
      method: 'GET',
      credentials: 'include'
    } )
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error('Sesión no válida');
        }
        return respuesta.json();
      })
      .then(() => {
        setEstado('autorizado');
      })
      .catch(() => {
        setEstado('no-autorizado');
      });
  }, []);

  if (estado === 'cargando') {
    return <main className="admin-cargando">Verificando acceso...</main>;
  }

  if (estado === 'no-autorizado') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
