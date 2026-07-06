import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../../context/AuthContext'; // <-- Importación por defecto sin llaves {}

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useContext(AuthContext);

  // Mientras se verifica si hay un usuario en el localStorage, mostramos una pantalla de carga pastel
  if (loading) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <p className="text-purple-600 font-medium animate-pulse">Verificando credenciales... ✨</p>
      </div>
    );
  }

  // 1. Si no hay usuario autenticado, redirigir al Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si el usuario está autenticado pero su rol no está en la lista de permitidos, redirigir a la tienda
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/shop" replace />;
  }

  // 3. Si todo está correcto, renderiza las rutas hijas usando <Outlet />
  return <Outlet />;
}
