import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';

const API_URL = 'http://localhost:3001';

const CarritoPage = () => {
  const {
    items,
    agregarItem,
    quitarItem,
    vaciarCarrito
  } = useCarrito();

  const [solicitudes, setSolicitudes] = useState([]);
  const [cargandoSolicitudes, setCargandoSolicitudes] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarSolicitudes = async () => {
      try {
        const respuesta = await fetch(
          `${API_URL}/api/solicitudes/mis-solicitudes`,
          {
            credentials: 'include'
          }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(
            datos.mensaje || 'No se pudieron cargar tus solicitudes'
          );
        }

        setSolicitudes(datos);
      } catch (errorCarga) {
        setError(errorCarga.message);
      } finally {
        setCargandoSolicitudes(false);
      }
    };

    cargarSolicitudes();
  }, []);

  return (
    <main className="holder">
      <p className="etiqueta">
        SOLICITUD DE PRESUPUESTO
      </p>

      <h2>Tu selección de piezas</h2>

      {items.length === 0 ? (
        <div className="novedad">
          <p>
            Todavía no agregaste ninguna pieza.
          </p>

          <Link
            className="boton"
            to="/novedades"
          >
            Ver catálogo
          </Link>
        </div>
      ) : (
        <>
          {items.map((item) => (
            <article
              className="novedad"
              key={item.id}
            >
              <h1>{item.nombre}</h1>

              <p>{item.descripcion}</p>

              <p>
                <strong>
                  Cantidad seleccionada: {item.cantidad}
                </strong>
              </p>

              <button
                className="boton"
                type="button"
                onClick={() => quitarItem(item.id)}
              >
                Quitar una
              </button>{' '}

              <button
                className="boton"
                type="button"
                onClick={() => agregarItem(item)}
              >
                Agregar otra
              </button>
            </article>
          ))}

          <button
            className="boton"
            type="button"
            onClick={vaciarCarrito}
          >
            Vaciar selección
          </button>{' '}

          <Link
            className="boton"
            to="/contacto"
          >
            Enviar consulta
          </Link>
        </>
      )}

      <section className="novedades">
        <p className="etiqueta">
          HISTORIAL
        </p>

        <h2>Mis solicitudes</h2>

        {cargandoSolicitudes && (
          <p>Cargando solicitudes...</p>
        )}

        {error && (
          <p className="mensaje-error">
            {error}
          </p>
        )}

        {!cargandoSolicitudes &&
          !error &&
          solicitudes.length === 0 && (
            <article className="novedad">
              <p>
                Todavía no tenés solicitudes enviadas.
              </p>
            </article>
          )}

        {!cargandoSolicitudes &&
          solicitudes.map((solicitud) => (
            <article
              className="novedad"
              key={solicitud.id}
            >
              <p className="etiqueta">
                SOLICITUD #{solicitud.id}
              </p>

              <h3>
                Estado: {solicitud.estado}
              </h3>

              <p>{solicitud.mensaje}</p>

              {solicitud.telefono && (
                <p>
                  Teléfono: {solicitud.telefono}
                </p>
              )}

              {solicitud.piezas &&
                solicitud.piezas.length > 0 && (
                  <>
                    <h4>Piezas solicitadas</h4>

                    <ul>
                      {solicitud.piezas.map((pieza, indice) => (
                        <li key={`${solicitud.id}-${indice}`}>
                          {pieza.nombre} — cantidad:{' '}
                          {pieza.cantidad}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

              <small>
                Fecha: {new Date(
                  solicitud.fecha_creacion
                ).toLocaleString()}
              </small>
            </article>
          ))}
      </section>
    </main>
  );
};

export default CarritoPage;
