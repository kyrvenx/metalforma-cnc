import React from 'react';
import { NavLink } from 'react-router-dom';
import { useCarrito } from '../../context/CarritoContext';
import { useAuth } from '../../context/AuthContext';

const enlacesPrincipales = [
  { texto: 'Inicio', ruta: '/' },
  { texto: 'Nosotros', ruta: '/nosotros' },
  { texto: 'Proyectos', ruta: '/novedades' },
  { texto: 'Contacto', ruta: '/contacto' }
];

const Nav = () => {
  const { cantidadTotal } = useCarrito();
  const { autenticado, cargando } = useAuth();

  return (
    <nav>
      <div className="holder nav-contenido">
        <ul className="nav-principal">
          {enlacesPrincipales.map((enlace) => (
            <li key={enlace.ruta}>
              <NavLink
                to={enlace.ruta}
                end={enlace.ruta === '/'}
                className={({ isActive }) =>
                  isActive ? 'activo' : ''
                }
              >
                {enlace.texto}
              </NavLink>
            </li>
          ))}

          {!cargando && autenticado && (
            <li>
              <NavLink
                to="/carrito"
                className={({ isActive }) =>
                  isActive ? 'activo' : ''
                }
              >
                Solicitud ({cantidadTotal})
              </NavLink>
            </li>
          )}
        </ul>

        <ul className="nav-accesos">
          <li>
            <NavLink
              to="/registro"
              className={({ isActive }) =>
                isActive ? 'activo' : ''
              }
            >
              Registrarse
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/login-usuario"
              className={({ isActive }) =>
                isActive ? 'activo' : ''
              }
            >
              Clientes
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
