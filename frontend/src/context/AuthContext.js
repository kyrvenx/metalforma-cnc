import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

const API_URL = 'http://localhost:3001';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/usuarios/sesion`, {
      method: 'GET',
      credentials: 'include'
    })
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error('No hay una sesión iniciada');
        }

        return respuesta.json();
      })
      .then((datos) => {
        setUsuario(datos.usuario);
      })
      .catch(() => {
        setUsuario(null);
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        usuario,
        autenticado: Boolean(usuario),
        cargando
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
