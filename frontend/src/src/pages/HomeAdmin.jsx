import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

export default function HomeAdmin() {
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalInventoryValue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Hacemos la petición al endpoint simplificado de métricas
        const response = await apiClient.get("/admin/metrics/dashboard");
        setMetrics({
          totalProducts: response.data.totalProducts || 0,
          totalUsers: response.data.totalUsers || 0,
          totalInventoryValue: response.data.totalInventoryValue || 0,
        });
      } catch (err) {
        console.error("Error al cargar métricas del dashboard:", err);
        setError("No se pudo sincronizar la información del servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-purple-600 font-bold animate-pulse text-lg">
          Analizando inventario y usuarios... 📊
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Dashboard de Control 🐾
        </h1>
        <p className="text-gray-500 text-sm font-medium mt-1">
          Resumen general de las existencias del catálogo, usuarios registrados y valor del inventario actual.
        </p>
      </div>

      {error && (
        <p className="bg-pink-100 text-pink-700 p-3 rounded-2xl text-xs font-bold text-center">
          {error}
        </p>
      )}

      {/* Grid de KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Productos Registrados */}
        <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/60 flex flex-col justify-between transition hover:shadow-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-purple-950 text-sm font-bold uppercase tracking-wider">
              Productos Registrados
            </h3>
            <span className="text-2xl bg-purple-100 p-2 rounded-xl">📦</span>
          </div>
          <p className="text-5xl font-black text-purple-600 mt-6">
            {metrics.totalProducts} <span className="text-lg font-medium text-purple-400">uds.</span>
          </p>
        </div>

        {/* Card 2: Usuarios Activos */}
        <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/60 flex flex-col justify-between transition hover:shadow-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-purple-950 text-sm font-bold uppercase tracking-wider">
              Usuarios Activos
            </h3>
            <span className="text-2xl bg-pink-100 p-2 rounded-xl">👥</span>
          </div>
          <p className="text-5xl font-black text-pink-500 mt-6">
            {metrics.totalUsers} <span className="text-lg font-medium text-pink-400">reg.</span>
          </p>
        </div>

        {/* Card 3: Cantidad de Plata en Inventario (Precio * Stock) */}
        <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/60 flex flex-col justify-between transition hover:shadow-2xl md:col-span-1">
          <div className="flex items-center justify-between">
            <h3 className="text-purple-950 text-sm font-bold uppercase tracking-wider">
              Valor de Inventario
            </h3>
            <span className="text-2xl bg-emerald-100 p-2 rounded-xl">💰</span>
          </div>
          <div>
            <p className="text-3xl font-black text-emerald-600 mt-6">
              ${metrics.totalInventoryValue.toLocaleString("es-CO")}
            </p>
            <p className="text-[11px] text-gray-400 font-bold mt-1">
              Capital total estimado (COP)
            </p>
          </div>
        </div>

      </div>

      {/* Información extra o decorativa de DOG-GO */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-md p-6 rounded-3xl border border-purple-100/40 text-center">
        <p className="text-purple-950 text-sm font-medium">
          🐾 Todo listo. Los datos reflejan el estado actual de tu base de datos de MySQL. Puedes agregar productos en el inventario para ver el incremento del capital en tiempo real.
        </p>
      </div>

    </div>
  );
}