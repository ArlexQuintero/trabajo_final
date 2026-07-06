import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function AdminPage() {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-tr from-pink-50 via-purple-50 to-indigo-50">
      
      {/* ================= SIDEBAR (Menú Lateral) ================= */}
      <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-purple-100 flex flex-col justify-between p-6 shadow-xl">
        <div className="space-y-8">
          {/* Logo o Identificador */}
          <div className="text-center">
            <h2 className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              DOG-GO Admin 🐾
            </h2>
            <p className="text-xs text-purple-950/60 font-bold mt-1">
              Hola, {user?.name || 'Administrador'}
            </p>
          </div>

          {/* Botones de Navegación del Panel */}
          <nav className="flex flex-col gap-2">
            
            {/* 1. BOTÓN NUEVO: Dashboard (Apunta directamente a /admin que es el HomeAdmin) */}
            <Link 
              to="/admin" 
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-purple-950 hover:bg-purple-100/60 hover:text-purple-700 transition"
            >
              <span>📊</span> Dashboard
            </Link>

            {/* 2. BOTÓN 2: Gestión de Productos (Lo que ya tenías) */}
            <Link 
              to="/admin/products" /* Ajusta la ruta secundaria si la cambias en App.jsx */
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-purple-950 hover:bg-purple-100/60 hover:text-purple-700 transition"
            >
              <span>🛍️</span> Productos
            </Link>

            {/* 4. BOTÓN 4: Gestión de Usuarios */}
            <Link 
              to="/admin/users"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-purple-950 hover:bg-purple-100/60 hover:text-purple-700 transition"
            >
              <span>👥</span> Usuarios
            </Link>
            {/* 5. BOTÓN 5: Catálogo */}
            <Link 
              to="/admin/catalogo"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-purple-950 hover:bg-purple-100/60 hover:text-purple-700 transition"
            >
              <span>📚</span> Catálogo
            </Link>
          </nav>
        </div>

        {/* Botón Inferior: Cerrar Sesión */}
        <button
          onClick={handleLogout}
          className="w-full bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold py-3 px-4 rounded-2xl text-sm transition flex items-center justify-center gap-2"
        >
          <span>🚪</span> Cerrar Sesión
        </button>
      </aside>

      {/* ================= CONTENIDO CENTRAL DINÁMICO ================= */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* 🔥 LA CLAVE: <Outlet /> actúa como un comodín. 
            Aquí es donde React Router inyectará automáticamente el HomeAdmin 
            apenas entres, o las otras páginas cuando les des clic en el Sidebar.
          */}
          <Outlet />
        </div>
      </main>

    </div>
  );
}
