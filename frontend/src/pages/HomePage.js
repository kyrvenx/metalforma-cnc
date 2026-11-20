import React from 'react';

const testimonios = [
  {
    cita: 'La pieza quedó exacta y el trabajo fue muy prolijo.',
    autor: 'Cliente industrial',
  },
  {
    cita: 'Encontramos una solución personalizada para nuestro proyecto.',
    autor: 'Emprendimiento local',
  },
];

const Testimonio = ({ cita, autor }) => (
  <article className="testimonio">
    <p className="cita">“{cita}”</p>
    <p className="autor">{autor}</p>
  </article>
);

const HomePage = () => {
  return (
    <main>
      
      <section
        className="catalogo-hero"
        style={{
          backgroundImage:
            "linear-gradient(rgba(10, 12, 14, 0.72), rgba(10, 12, 14, 0.86)), url('/img/inicio.jpg')",
        }}
      >
        <div className="holder catalogo-hero-contenido">
          <p className="etiqueta">
            DISEÑO · MECANIZADO · PRECISIÓN
          </p>

          <h2>
            Precisión impulsada por tecnología CNC
          </h2>

          <p>
            Piezas metálicas que toman forma con precisión.
            Diseñamos y fabricamos soluciones para proyectos
            industriales, comerciales y personales.
          </p>

          <a
            className="boton"
            href="/contacto"
          >
            Solicitar presupuesto
          </a>
        </div>
      </section>

      
      <section className="holder inicio-contenido">
        <div className="homeimg">
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
                    width: '80%',
                    aspectRatio: '16 / 9',
                    height: '50%',
                    objectFit: 'cover',
                    display: 'block',
                    margin: '0 auto',
                  }}

          >
            <source
              src="/video/metalforma-inicio.mp4"
              type="video/mp4"
            />

            Tu navegador no puede reproducir este video.
          </video>
        </div>

        <div className="columnas">
          <div className="bienvenidos">
            <p className="etiqueta">
              NUESTRA PROPUESTA
            </p>

            <h2>
              Del plano a la pieza terminada
            </h2>

            <p>
              En MetalForma CNC trabajamos cada encargo con
              atención al detalle, buscando que el resultado sea
              funcional, resistente y fiel a la idea original.
            </p>
          </div>

          <div className="testimonios">
            <p className="etiqueta">
              EXPERIENCIAS
            </p>

            <h2>
              Lo que valoran nuestros clientes
            </h2>

            {testimonios.map((testimonio) => (
              <Testimonio
                key={testimonio.autor}
                {...testimonio}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
