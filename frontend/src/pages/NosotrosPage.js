import React from 'react';

const equipo = [
  {
    imagen: '/images/nosotros/nosotros1.jpg',
    nombre: 'Diseño y planificación',
    cargo: 'Del concepto al plano',
    descripcion:
      'Analizamos cada proyecto y definimos la mejor forma de convertirlo en una pieza fabricable.',
  },
  {
    imagen: '/images/nosotros/nosotros2.jpg',
    nombre: 'Mecanizado CNC',
    cargo: 'Precisión en cada corte',
    descripcion:
      'Trabajamos con procesos ordenados para obtener terminaciones consistentes y confiables.',
  },
  {
    imagen: '/images/nosotros/nosotros3.jpg',
    nombre: 'Control y entrega',
    cargo: 'Un resultado que cumple',
    descripcion:
      'Revisamos cada trabajo antes de entregarlo y acompañamos al cliente durante el proceso.',
  },
];

const AreaTrabajo = ({ imagen, nombre, cargo, descripcion }) => (
  <article className="persona">
    <img src={imagen} alt={nombre} />
    <h5>{nombre}</h5>
    <h6>{cargo}</h6>
    <p>{descripcion}</p>
  </article>
);

const NosotrosPage = () => {
  return (
    <main>
      <section
        className="catalogo-hero"
        style={{
          backgroundImage:
            "linear-gradient(rgba(10, 12, 14, 0.72), rgba(10, 12, 14, 0.86)), url('/img/nosotros.jpg')",
        }}
      >
        <div className="holder catalogo-hero-contenido">
          <p className="etiqueta">METALFORMA CNC</p>
          <h2>Un taller donde las ideas se convierten en metal</h2>
          <p>
            Conocé nuestra forma de trabajar y el proceso que acompaña cada
            pieza, desde la planificación hasta la entrega.
          </p>
        </div>
      </section>

      <section className="holder nosotros-contenido">
        <div className="historia">
          <p className="etiqueta">NUESTRA HISTORIA</p>
          <h2>Precisión, compromiso y atención al detalle</h2>
          <p>
            MetalForma CNC nace como una propuesta dedicada a la fabricación de
            piezas metálicas personalizadas mediante herramientas de diseño y
            mecanizado de precisión.
          </p>
          <p>
            Nuestro objetivo es acompañar cada proyecto con responsabilidad,
            comunicación clara y una mirada técnica sobre cada necesidad.
          </p>
        </div>

        <div className="staff">
          <p className="etiqueta">CÓMO TRABAJAMOS</p>
          <h2>Un proceso pensado para cada proyecto</h2>
          <div className="personas">
            {equipo.map((area) => (
              <AreaTrabajo key={area.nombre} {...area} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default NosotrosPage;
