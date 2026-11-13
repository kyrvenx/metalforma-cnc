import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:3001';

const ContactoPage = () => {
  const { items, vaciarCarrito } = useCarrito();
  const { autenticado } = useAuth();
  const navigate = useNavigate();

  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const manejarEnvio = async (evento) => {
    evento.preventDefault();

    if (!autenticado) {
      navigate('/login-usuario');
      return;
    }

    setEnviado(false);
    setError('');
    setCargando(true);

    const formulario = new FormData(evento.target);

    const datos = {
      telefono: formulario.get('telefono'),
      mensaje: formulario.get('mensaje'),
      piezas: items.map((item) => ({
        nombre: item.nombre,
        cantidad: item.cantidad
      }))
    };

    try {
      const respuesta = await fetch(
        `${API_URL}/api/solicitudes`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(datos)
        }
      );

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          resultado.mensaje || 'No se pudo enviar la solicitud'
        );
      }

      setEnviado(true);
      vaciarCarrito();
      evento.target.reset();
    } catch (errorEnvio) {
      console.error(
        'Error al enviar solicitud:',
        errorEnvio
      );

      setError(errorEnvio.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="holder contacto">
      <section>
        <p className="etiqueta">
          HABLEMOS DE TU PROYECTO
        </p>

        <h2>Solicitá un presupuesto</h2>

        <p>
          Completá el formulario y contanos qué pieza necesitás
          fabricar.
        </p>

        {!autenticado && (
          <div className="novedad">
            <h3>Iniciá sesión para enviar una solicitud</h3>

            <p>
              Para guardar tu solicitud y consultar su estado,
              primero tenés que ingresar como cliente.
            </p>

            <Link
              className="boton"
              to="/login-usuario"
            >
              Ir a Clientes
            </Link>
          </div>
        )}

        {items.length > 0 && (
          <div className="novedad">
            <h3>Piezas seleccionadas</h3>

            <ul>
              {items.map((item) => (
                <li key={item.id}>
                  {item.nombre} — cantidad: {item.cantidad}
                </li>
              ))}
            </ul>
          </div>
        )}

        {items.length === 0 && (
          <p>
            No seleccionaste piezas. Podés enviar una consulta
            general o{' '}
            <Link to="/novedades">
              ver el catálogo
            </Link>.
          </p>
        )}

        <form
          className="formulario"
          onSubmit={manejarEnvio}
        >
          <p>
            <label htmlFor="telefono">
              Teléfono
            </label>

            <input
              id="telefono"
              name="telefono"
              type="tel"
            />
          </p>

          <p>
            <label htmlFor="mensaje">
              Detalle del proyecto
            </label>

            <textarea
              id="mensaje"
              name="mensaje"
              rows="6"
              placeholder="Contanos qué pieza necesitás y qué características debería tener"
              required
            ></textarea>
          </p>

          <p className="acciones">
            <input
              type="submit"
              value={
                cargando
                  ? 'Enviando...'
                  : 'Enviar consulta'
              }
              disabled={cargando || !autenticado}
            />
          </p>
        </form>

        {enviado && (
          <p className="mensaje-exito">
            Tu solicitud fue enviada correctamente.
          </p>
        )}

        {error && (
          <p className="mensaje-error">
            {error}
          </p>
        )}
      </section>

      <aside className="datos">
        <p className="etiqueta">
          METALFORMA CNC
        </p>

        <h2>Del plano a la pieza</h2>

        <p>
          Analizamos cada solicitud para ofrecer una propuesta
          acorde al uso, las medidas y las características del
          proyecto.
        </p>

        <ul>
          <li>Diseño y planificación</li>
          <li>Mecanizado de precisión</li>
          <li>Piezas personalizadas</li>
          <li>Solicitud de presupuesto</li>
        </ul>
      </aside>
    </main>
  );
};

export default ContactoPage;
