import React from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';

const CarritoPage = () => {
  const { items, agregarItem, quitarItem, vaciarCarrito } = useCarrito();

  return (
    <main className="holder">
      <p className="etiqueta">SOLICITUD DE PRESUPUESTO</p>
      <h2>Tu selección de piezas</h2>

      {items.length === 0 ? (
        <div className="novedad">
          <p>Todavía no agregaste ninguna pieza.</p>
          <Link className="boton" to="/novedades">
            Ver catálogo
          </Link>
        </div>
      ) : (
        <>
          {items.map((item) => (
            <article className="novedad" key={item.id}>
              <h1>{item.nombre}</h1>
              <p>{item.descripcion}</p>
              <p><strong>Cantidad seleccionada: {item.cantidad}</strong></p>
              <button className="boton" type="button" onClick={() => quitarItem(item.id)}>
                Quitar una
              </button>{' '}
              <button className="boton" type="button" onClick={() => agregarItem(item)}>
                Agregar otra
              </button>
            </article>
          ))}

          <button className="boton" type="button" onClick={vaciarCarrito}>
            Vaciar selección
          </button>{' '}
          <Link className="boton" to="/contacto">
            Enviar consulta
          </Link>
        </>
      )}
    </main>
  );
};

export default CarritoPage;
