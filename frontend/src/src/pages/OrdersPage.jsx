import { Link } from 'react-router-dom';

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50/50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-black text-purple-950">Mis Pedidos Realizados</h2>
          <Link to="/shop" className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-5 py-2 rounded-full text-xs sm:text-sm font-bold shadow-md hover:opacity-90 transition">
            Volver a la Tienda 🛍️
          </Link>
        </div>

        {/* Card de Estado Vacío Ilustrado */}
        <div className="bg-white/80 backdrop-blur-md p-16 rounded-3xl text-center border border-pink-200/40 shadow-xl max-w-2xl mx-auto transform hover:scale-[1.01] transition duration-300">
          <div className="w-24 h-24 bg-gradient-to-tr from-pink-200 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md shadow-pink-200/60 animate-bounce">
            <span className="text-4xl">🌸</span>
          </div>
          <h3 className="text-2xl font-black text-purple-950 mb-3">¿Aún no has comprado?</h3>
          <p className="text-gray-500 font-medium text-sm max-w-sm mx-auto mb-8 leading-relaxed">
            Cuando realices un pedido desde tu carrito, verás el historial detallado aquí junto con sus estados de aprobación en tiempo real.
          </p>
          <Link to="/shop" className="text-purple-600 font-bold hover:underline text-sm bg-purple-100/60 px-5 py-2.5 rounded-full transition">
            ¡Empezar a llenar el carrito!
          </Link>
        </div>
      </div>
    </div>
  );
}
