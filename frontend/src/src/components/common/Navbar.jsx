import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout(); 
    navigate('/');
  };

  // Evaluar si estamos dentro de la ruta de administración
  const isAdminView = location.pathname.startsWith('/admin');

  return (
    <nav className="bg-white/70 backdrop-blur-xl border-b border-purple-100 sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm">
      {/* Logo / Título del proyecto */}
      <Link to="/" className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
        DOG-GO ✨
      </Link>

      {/* Menú de Navegación central / derecho */}
      <div className="flex items-center gap-6">
        <Link to="/shop" className="text-purple-950 font-bold hover:text-purple-600 transition text-sm">
          Catálogo 🛍️
        </Link>

        {/* 🌟 BOTONES ESPECIALES PARA EL ADMINISTRADOR */}
        {user && user.role === 'admin' && (
          isAdminView ? (
            <Link to="/shop" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-md shadow-pink-100 hover:opacity-90 transition">
              Ir al Catálogo 🛒
            </Link>
          ) : (
            <Link to="/admin" className="bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-md shadow-purple-100 hover:bg-purple-700 transition">
              Panel Admin ⚙️
            </Link>
          )
        )}

        <div className="h-4 w-[1px] bg-purple-200"></div>

        {/* 🔒 SECCIÓN DE AUTENTICACIÓN DINÁMICA */}
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-700 text-sm font-semibold bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-100">
              Hola, <strong className="text-purple-700 capitalize">{user.name}</strong> 🌸
            </span>
            <button
              onClick={handleLogout}
              className="text-pink-600 hover:text-pink-700 font-bold text-sm transition"
            >
              Cerrar Sesión 🚪
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm px-6 py-2.5 rounded-full shadow-lg shadow-purple-100 hover:opacity-95 transition"
          >
            Iniciar Sesión
          </Link>
        )}
      </div>
    </nav>
  );
}
