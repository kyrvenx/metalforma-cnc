import React, { useEffect, useState } from 'react';
import { useCarrito } from '../context/CarritoContext';

const API_URL = 'http://localhost:3001';

const NovedadesPage = () => {
  const { agregarItem } = useCarrito();

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Proyectos | MetalForma CNC';

    const cargarProductos = async () => {
      try {
        const respuesta = await fetch(
          `${API_URL}/api/admin/novedades`
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(
            datos.mensaje || 'No se pudieron cargar los proyectos'
          );
        }

        setProductos(datos);
      } catch (errorCarga) {
        setError(errorCarga.message);
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();

    return () => {
      document.title = 'MetalForma CNC';
    };
  }, []);

  return (
    <main className="catalogo-pagina">
      <section
        className="catalogo-hero"
        style={{
          backgroundImage:
            "linear-gradient(rgba(10, 12, 14, 0.78), rgba(10, 12, 14, 0.86)), url('/img/proyectos.jpg')"
        }}
      >
        <div className="holder catalogo-hero-contenido">
          <p className="etiqueta">
            METALFORMA CNC
          </p>

          <h2>
            Proyectos que toman forma
          </h2>

          <p>
            Seleccioná una pieza de referencia y armá tu solicitud
            de presupuesto.
          </p>
        </div>
      </section>

      <section className="holder catalogo-contenido">
        <p className="etiqueta">
          CATÁLOGO DE REFERENCIA
        </p>

        <h2>
          Elegí una pieza para solicitar presupuesto
        </h2>

        {cargando && (
          <p>
            Cargando proyectos...
          </p>
        )}

        {error && (
          <p className="mensaje-error">
            {error}
          </p>
        )}

        {!cargando &&
          !error &&
          productos.length === 0 && (
            <p>
              No hay proyectos publicados.
            </p>
          )}

        {!cargando &&
          !error &&
          productos.length > 0 && (
            <div className="novedades">
              {productos.map((producto) => (
                <article
                  className="novedad"
                  key={producto.id}
                >
                  {producto.imagen && (
                    <div className="imagen-proyecto-contenedor">
                      <img
                        src={producto.imagen}
                        alt={producto.titulo}
                        className="imagen-proyecto"
                      />
                    </div>
                  )}

                  <p className="etiqueta">
                    PIEZA CNC
                  </p>

                  <h1>
                    {producto.titulo}
                  </h1>

                  <p>
                    {producto.descripcion}
                  </p>

                  <button
                    className="boton"
                    type="button"
                    onClick={() =>
                      agregarItem({
                        id: producto.id,
                        nombre: producto.titulo,
                        descripcion: producto.descripcion,
                        imagen: producto.imagen
                      })
                    }
                  >
                    Agregar a la solicitud
                  </button>
                </article>
              ))}
            </div>
          )}
      </section>
    </main>
  );
};

export default NovedadesPage;
