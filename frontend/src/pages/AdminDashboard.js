import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3001';

const formularioInicial = {
  titulo: '',
  descripcion: '',
  imagen: ''
};

const AdminDashboard = ( ) => {
  const navigate = useNavigate();

  const [novedades, setNovedades] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarNovedades();
  }, []);

  const cargarNovedades = async () => {
    try {
      setCargando(true);
      setError('');

      const respuesta = await fetch(`${API_URL}/api/admin/novedades`, {
        method: 'GET',
        credentials: 'include'
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'No se pudieron cargar los proyectos');
      }

      setNovedades(datos);
    } catch (errorCarga) {
      setError(errorCarga.message);
    } finally {
      setCargando(false);
    }
  };

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;

    setFormulario((formularioAnterior) => ({
      ...formularioAnterior,
      [name]: value
    }));
  };

  const limpiarFormulario = () => {
    setFormulario(formularioInicial);
    setEditandoId(null);
  };

  const manejarEnvio = async (evento) => {
    evento.preventDefault();

    setMensaje('');
    setError('');
    setGuardando(true);

    const metodo = editandoId ? 'PUT' : 'POST';
    const url = editandoId
      ? `${API_URL}/api/admin/novedades/${editandoId}`
      : `${API_URL}/api/admin/novedades`;

    try {
      const respuesta = await fetch(url, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formulario)
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'No se pudo guardar el proyecto');
      }

      setMensaje(
        editandoId
          ? 'Proyecto actualizado correctamente.'
          : 'Proyecto creado correctamente.'
      );

      limpiarFormulario();
      await cargarNovedades();
    } catch (errorGuardado) {
      setError(errorGuardado.message);
    } finally {
      setGuardando(false);
    }
  };

  const editarNovedad = (novedad) => {
    setEditandoId(novedad.id);

    setFormulario({
      titulo: novedad.titulo || '',
      descripcion: novedad.descripcion || '',
      imagen: novedad.imagen || ''
    });

    setMensaje('');
    setError('');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const eliminarNovedad = async (id) => {
    const confirmar = window.confirm(
      '¿Seguro que querés eliminar este proyecto?'
    );

    if (!confirmar) {
      return;
    }

    try {
      setMensaje('');
      setError('');

      const respuesta = await fetch(
        `${API_URL}/api/admin/novedades/${id}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'No se pudo eliminar el proyecto');
      }

      setMensaje('Proyecto eliminado correctamente.');
      await cargarNovedades();
    } catch (errorEliminacion) {
      setError(errorEliminacion.message);
    }
  };

  const cerrarSesion = async () => {
    try {
      await fetch(`${API_URL}/api/admin/logout`, {
        method: 'POST',
        credentials: 'include'
      });

      navigate('/login');
    } catch (errorCierre) {
      setError('No se pudo cerrar la sesión.');
    }
  };

  return (
    <main className="admin-dashboard">
      <div className="holder">
        <div className="admin-encabezado">
          <div>
            <p className="admin-etiqueta">ÁREA RESTRINGIDA</p>

            <h1>Panel administrativo</h1>

            <p>
              Gestioná los proyectos publicados de MetalForma CNC.
            </p>
          </div>

          <button
            className="admin-boton-salir"
            type="button"
            onClick={cerrarSesion}
          >
            Cerrar sesión
          </button>
        </div>

        {mensaje && (
          <p className="admin-mensaje admin-mensaje-exito">
            {mensaje}
          </p>
        )}

        {error && (
          <p className="admin-mensaje admin-mensaje-error">
            {error}
          </p>
        )}

        <section className="admin-formulario">
          <div>
            <p className="admin-etiqueta">
              {editandoId ? 'EDITAR PROYECTO' : 'NUEVO PROYECTO'}
            </p>

            <h2>
              {editandoId
                ? 'Modificar proyecto'
                : 'Agregar proyecto al catálogo'}
            </h2>
          </div>

          <form onSubmit={manejarEnvio}>
            <label htmlFor="titulo">
              Título del proyecto
            </label>

            <input
              id="titulo"
              name="titulo"
              type="text"
              value={formulario.titulo}
              onChange={manejarCambio}
              placeholder="Ejemplo: Placa metálica personalizada"
              required
            />

            <label htmlFor="descripcion">
              Descripción
            </label>

            <textarea
              id="descripcion"
              name="descripcion"
              value={formulario.descripcion}
              onChange={manejarCambio}
              placeholder="Describí el proyecto o pieza"
              required
            />

            <label htmlFor="imagen">
              Ruta de la imagen
            </label>

            <input
              id="imagen"
              name="imagen"
              type="text"
              value={formulario.imagen}
              onChange={manejarCambio}
              placeholder="/images/proyectos/proyecto1.jpg"
            />

            <div className="admin-formulario-acciones">
              <button
                className="admin-boton-principal"
                type="submit"
                disabled={guardando}
              >
                {guardando
                  ? 'Guardando...'
                  : editandoId
                    ? 'Guardar cambios'
                    : 'Agregar proyecto'}
              </button>

              {editandoId && (
                <button
                  className="admin-boton-secundario"
                  type="button"
                  onClick={limpiarFormulario}
                >
                  Cancelar edición
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="admin-listado">
          <div className="admin-listado-titulo">
            <div>
              <p className="admin-etiqueta">CONTENIDO ACTUAL</p>
              <h2>Proyectos publicados</h2>
            </div>

            <button
              className="admin-boton-secundario"
              type="button"
              onClick={cargarNovedades}
            >
              Actualizar lista
            </button>
          </div>

          {cargando ? (
            <p className="admin-cargando-lista">
              Cargando proyectos...
            </p>
          ) : novedades.length === 0 ? (
            <p className="admin-cargando-lista">
              No hay proyectos cargados.
            </p>
          ) : (
            <div className="admin-proyectos">
              {novedades.map((novedad) => (
                <article
                  className="admin-proyecto"
                  key={novedad.id}
                >
                  <div className="admin-proyecto-contenido">
                    <p className="admin-proyecto-id">
                      PROYECTO #{novedad.id}
                    </p>

                    <h3>{novedad.titulo}</h3>

                    <p>{novedad.descripcion}</p>

                    {novedad.imagen && (
                      <small>
                        Imagen: {novedad.imagen}
                      </small>
                    )}
                  </div>

                  <div className="admin-proyecto-acciones">
                    <button
                      className="admin-boton-secundario"
                      type="button"
                      onClick={() => editarNovedad(novedad)}
                    >
                      Editar
                    </button>

                    <button
                      className="admin-boton-eliminar"
                      type="button"
                      onClick={() => eliminarNovedad(novedad.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default AdminDashboard;
