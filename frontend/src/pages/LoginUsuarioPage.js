import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

const API_URL = 'http://localhost:3001';

const LoginUsuarioPage = ( ) => {
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    email: '',
    password: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value
    }));
  };

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    setMensaje('');
    setCargando(true);

    try {
      const respuesta = await fetch(`${API_URL}/api/usuarios/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formulario)
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje || 'No se pudo iniciar sesión'
        );
      }

      setMensaje(`Bienvenido/a, ${datos.usuario.nombre}.`);

      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <p className="login-card__badge">
          METALFORMA CNC
        </p>

        <h1>Acceso de clientes</h1>

        <p className="login-card__intro">
          Iniciá sesión para acceder a beneficios exclusivos y gestionar tus
          solicitudes de presupuesto.
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
            placeholder="tu correo electrónico"
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
            placeholder="Tu contraseña"
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
              mensaje.includes('Bienvenido') ? 'success' : 'error'
            }`}
          >
            {mensaje}
          </p>
        )}

        <p className="login-enlace">
          ¿Todavía no tenés una cuenta?{' '}
          <Link to="/registro">
            Crear cuenta
          </Link>
        </p>

        <Link className="login-back" to="/">
          Volver al sitio
        </Link>
      </section>
    </main>
  );
};

export default LoginUsuarioPage;
