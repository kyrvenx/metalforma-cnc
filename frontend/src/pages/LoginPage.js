import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const API_URL = 'http://localhost:3001';

function LoginPage( ) {
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    email: '',
    password: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  function manejarCambio(evento) {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value
    }));
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    setMensaje('');
    setCargando(true);

    try {
      const respuesta = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formulario)
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'No se pudo iniciar sesión');
      }

      setMensaje('Login correcto. Acceso administrativo habilitado.');

      setTimeout(() => {
        navigate('/admin');
      }, 900);
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-card__badge">
          METALFORMA CNC
        </div>

        <h1>Acceso administrativo</h1>

        <p className="login-card__intro">
          Ingresá al panel de gestión de MetalForma CNC.
        </p>

        <form onSubmit={manejarEnvio} className="login-form">
          <label htmlFor="email">
            Correo electrónico
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={formulario.email}
            onChange={manejarCambio}
            placeholder="admin@metalforma.com"
            autoComplete="email"
            required
          />

          <label htmlFor="password">
            Contraseña
          </label>

          <input
            id="password"
            name="password"
            type="password"
            value={formulario.password}
            onChange={manejarCambio}
            placeholder="Ingresá tu contraseña"
            autoComplete="current-password"
            required
          />

          <button type="submit" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        {mensaje && (
          <p
            className={`login-message ${
              mensaje.includes('correcto') ? 'success' : 'error'
            }`}
          >
            {mensaje}
          </p>
        )}

        <button
          type="button"
          className="login-back"
          onClick={() => navigate('/')}
        >
          Volver al sitio
        </button>
      </section>
    </main>
  );
}

export default LoginPage;
