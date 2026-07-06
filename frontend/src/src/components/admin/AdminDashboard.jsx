import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    try {
      // Dejamos el inicio en true al arrancar la solicitud asíncrona
      setLoading(true);
      const response = await apiClient.get("/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error al obtener pedidos globales:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Declaramos una función interna autoejecutable o simplemente llamamos al método externo
    const cargarDatos = async () => {
      await fetchAllOrders();
    };

    cargarDatos();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await apiClient.put(`/orders/${id}/status`, { status: newStatus });
      alert(`Pedido actualizado a: ${newStatus}`);
      fetchAllOrders(); // Recarga la lista de forma asíncrona tras la actualización
    } catch (error) {
      console.error("Error al modificar estado:", error);
      alert("Error al modificar el estado del pedido");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg font-semibold text-gray-600 animate-pulse">
          Cargando Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-8">
        Panel de Administración
      </h2>

      {/* Resumen analítico */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg shadow-sm">
          <h3 className="text-blue-800 font-bold text-lg">Total de Pedidos</h3>
          <p className="text-3xl font-black text-blue-900 mt-2">
            {orders.length}
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 p-6 rounded-lg shadow-sm">
          <h3 className="text-green-800 font-bold text-lg">Ingresos Totales</h3>
          <p className="text-3xl font-black text-green-900 mt-2">
            $
            {orders
              .reduce((acc, order) => acc + parseFloat(order.total || 0), 0)
              .toFixed(2)}
          </p>
        </div>
      </div>

      {/* Listado General de Pedidos */}
      <div className="bg-white rounded-lg shadow-md border overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-xs font-bold border-b">
              <th className="p-4">ID Pedido</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Fecha</th>
              <th className="p-4">Total</th>
              <th className="p-4">Estado Actual</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y text-gray-600 text-sm">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-400">
                  No hay pedidos registrados en el sistema.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="p-4 font-bold text-gray-900">#{order.id}</td>
                  <td className="p-4">{order.cliente}</td>
                  <td className="p-4">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-semibold text-gray-900">
                    ${parseFloat(order.total).toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                        order.status === "pendiente"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "Aprobado"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Rechazado"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2 justify-center">
                    <button
                      onClick={() => updateStatus(order.id, "Aprobado")}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => updateStatus(order.id, "Rechazado")}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition"
                    >
                      Rechazar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
