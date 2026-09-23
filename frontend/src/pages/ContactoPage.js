import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';

const ContactoPage = () => {
  const { items, vaciarCarrito } = useCarrito();
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState(false);

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    setEnviado(false);
    setError(false);

    const formulario = new FormData(evento.target);
    const datos = Object.fromEntries(formulario.entries());

    const seleccion = items.map((item) => ({
      nombre: item.nombre,
      cantidad: item.cantidad,
    }));

    try {
      const respuesta = await fetch(
        'http://localhost:3001/api/transportes/contacto',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...datos, piezas: seleccion } ),
        }
      );

      if (!respuesta.ok) {
        throw new Error('No se pudo enviar la solicitud');
      }

      setEnviado(true);
      vaciarCarrito();
      evento.target.reset();
    } catch (errorEnvio) {
      console.error(errorEnvio);
      setError(true);
    }
  };

  return (
    <main className="holder contacto">
      <section>
        <p className="etiqueta">HABLEMOS DE TU PROYECTO</p>
        <h2>Solicitá un presupuesto</h2>
        <p>
          Completá el formulario y contanos qué pieza necesitás fabricar.
          También podés seleccionar productos desde la sección Proyectos.
        </p>

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
            No seleccionaste piezas. Podés enviar una consulta general o{' '}
            <Link to="/novedades">ver el catálogo</Link>.
          </p>
        )}

        <form className="formulario" onSubmit={manejarEnvio}>
          <p>
            <label htmlFor="nombre">Nombre</label>
            <input id="nombre" name="nombre" type="text" required />
          </p>

          <p>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />
          </p>

          <p>
            <label htmlFor="telefono">Teléfono</label>
            <input id="telefono" name="telefono" type="tel" />
          </p>

          <p>
            <label htmlFor="mensaje">Detalle del proyecto</label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows="6"
              placeholder="Contanos qué pieza necesitás y qué características debería tener"
              required
            ></textarea>
          </p>

          <p className="acciones">
            <input type="submit" value="Enviar consulta" />
          </p>
        </form>

        {enviado && (
          <p className="mensaje-exito">
            Tu consulta y tu selección fueron enviadas correctamente.
          </p>
        )}

        {error && (
          <p className="mensaje-error">
            No se pudo enviar la consulta. Verificá que el backend esté activo.
          </p>
        )}
      </section>

      <aside className="datos">
        <p className="etiqueta">METALFORMA CNC</p>
        <h2>Del plano a la pieza</h2>
        <p>
          Analizamos cada solicitud para ofrecer una propuesta acorde al uso,
          las medidas y las características del proyecto.
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
