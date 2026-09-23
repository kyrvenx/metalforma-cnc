import React, { useEffect } from 'react';
import { useCarrito } from '../context/CarritoContext';

const productos = [
  {
    id: 1,
    nombre: 'Placa metálica personalizada',
    descripcion:
      'Pieza adaptable para señalización, identificación o proyectos especiales, fabricada según las medidas y necesidades del cliente.',
    imagen: '/images/proyectos/proyecto1.jpg'
  },
  {
    id: 2,
    nombre: 'Engranaje de perfil especial a medida',
    descripcion:
      'Engranaje diseñado según las medidas, la cantidad de dientes y las necesidades específicas de cada mecanismo o proyecto.',
    imagen: '/images/proyectos/proyecto2.jpg'
  },
  {
    id: 3,
    nombre: 'Pieza mecanizada a medida',
    descripcion:
      'Desarrollamos piezas metálicas personalizadas según las dimensiones, tolerancias y características de cada proyecto.',
    imagen: '/images/proyectos/proyecto3.jpg'
  },
  {
    id: 4,
    nombre: 'Eje de levas mecanizado de precisión',
    descripcion:
      'Componente cilíndrico fabricado mediante mecanizado CNC, diseñado para sistemas mecánicos que requieren precisión, resistencia y movimiento sincronizado.',
    imagen:  '/images/proyectos/proyecto4.jpg'

  }
];

const NovedadesPage = () => {
  const { agregarItem } = useCarrito();

  useEffect(() => {
    document.title = 'Proyectos | MetalForma CNC';

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
          <p className="etiqueta">METALFORMA CNC</p>

          <h2>Proyectos que toman forma</h2>

          <p>
            Seleccioná una pieza de referencia y armá tu solicitud de
            presupuesto. Cada trabajo puede adaptarse a las necesidades de tu
            proyecto.
          </p>
        </div>
      </section>

      <section className="holder catalogo-contenido">
        <p className="etiqueta">CATÁLOGO DE REFERENCIA</p>

        <h2>Elegí una pieza para solicitar presupuesto</h2>

        <div className="novedades">
          {productos.map((producto) => (
            <article className="novedad" key={producto.id}>
              <div className="imagen-proyecto-contenedor">
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="imagen-proyecto"
                />
              </div>

              <p className="etiqueta">PIEZA CNC</p>

              <h1>{producto.nombre}</h1>

              <p>{producto.descripcion}</p>

              <button
                className="boton"
                type="button"
                onClick={() => agregarItem(producto)}
              >
                Agregar a la solicitud
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default NovedadesPage;
