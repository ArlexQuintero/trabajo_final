import Cart from '../components/client/Cart';
import { Link } from 'react-router-dom';

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-100/60 via-pink-50 to-indigo-100/40 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto mb-6">
        <Link to="/shop" className="inline-flex items-center gap-2 text-purple-700 font-bold hover:text-pink-600 transition text-sm bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-purple-200/30">
          ← Continuar Comprando
        </Link>
      </div>

      {/* Envoltorio de la tarjeta del carrito */}
      <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/80">
        <div className="border-b border-purple-100 pb-4 mb-6">
          <h2 className="text-3xl font-black text-purple-950 flex items-center gap-2">
            Tu Bolsa de Compras <span className="text-2xl">✨</span>
          </h2>
        </div>
        <Cart />
      </div>
    </div>
  );
}