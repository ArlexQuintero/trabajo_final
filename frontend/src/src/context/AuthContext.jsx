import { createContext, useState } from 'react';

// Contexto interno
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Inicialización síncrona y limpia del usuario desde el localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    return (storedUser && storedToken) ? JSON.parse(storedUser) : null;
  });

  // Dejamos solo 'loading' sin el 'setLoading' que causaba el error de variable no usada
  const [loading] = useState(false);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
