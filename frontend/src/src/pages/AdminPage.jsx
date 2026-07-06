import { useState } from 'react';
import Navbar from '../components/common/Navbar';
import AdminUsers from '../components/admin/AdminUsers';
import AdminProducts from '../components/admin/AdminProducts';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('usuarios'); 

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-50 via-purple-50 to-indigo-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row-reverse">
        
        {/* ================= SIDEBAR DERECHA (MENÚ) ================= */}
        <aside className="w-full md:w-64 bg-white/80 backdrop-blur-md border-b md:border-b-0 md:border-l border-purple-100 p-6 flex flex-col gap-3">
          <div className="mb-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-purple-400">Navegación Interna</h3>
            <p className="text-sm font-medium text-gray-500">Panel de Control</p>
          </div>

          <button
            onClick={() => setActiveTab('usuarios')}
            className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-sm transition flex items-center gap-3 ${
              activeTab === 'usuarios'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-100'
                : 'text-purple-950 hover:bg-purple-50/50'
            }`}
          >
            👥 Gestión de Usuarios
          </button>

          <button
            onClick={() => setActiveTab('productos')}
            className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-sm transition flex items-center gap-3 ${
              activeTab === 'productos'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-100'
                : 'text-purple-950 hover:bg-purple-50/50'
            }`}
          >
            📦 Inventario Productos
          </button>
        </aside>

        {/* ================= CONTENIDO CENTRAL DINÁMICO ================= */}
        <main className="flex-1 p-8">
          {activeTab === 'usuarios' ? <AdminUsers /> : <AdminProducts />}
        </main>

      </div>
    </div>
  );
}
