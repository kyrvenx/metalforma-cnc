import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

const API_URL = 'http://localhost:3001';

const RegistroPage = ( ) => {
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    nombre: '',
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
      const respuesta = await fetch(`${API_URL}/api/usuarios/registro`, {
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
          datos.mensaje || 'No se pudo completar el registro'
        );
      }

      setMensaje('Registro exitoso. Ahora podés iniciar sesión.');

      setFormulario({
        nombre: '',
        email: '',
        password: ''
      });

      setTimeout(() => {
        navigate('/login-usuario');
      }, 1200);
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

        <h1>Crear cuenta</h1>

        <p className="login-card__intro">
          Registrate para acceder a beneficios y guardar tus solicitudes de
          presupuesto.
        </p>

        <form onSubmit={manejarEnvio} className="login-form">
          <label htmlFor="nombre">
            Nombre completo
          </label>

          <input
            id="nombre"
            name="nombre"
            type="text"
            value={formulario.nombre}
            onChange={manejarCambio}
            placeholder="Tu nombre"
            autoComplete="name"
            required
          />

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
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
            minLength="6"
            required
          />

          <button type="submit" disabled={cargando}>
            {cargando ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>

        {mensaje && (
          <p
            className={`login-message ${
              mensaje.includes('exitoso') ? 'success' : 'error'
            }`}
          >
            {mensaje}
          </p>
        )}

        <p className="login-enlace">
          ¿Ya tenés una cuenta?{' '}
          <Link to="/login-usuario">
            Iniciar sesión
          </Link>
        </p>

        <Link className="login-back" to="/">
          Volver al sitio
        </Link>
      </section>
    </main>
  );
};

export default RegistroPage;
