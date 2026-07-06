import { useState, useEffect, useContext } from 'react';
import Navbar from '../components/common/Navbar';
import { CartContext } from '../context/CartContext';
import apiClient from '../api/apiClient';

export default function ShopPage() {
  const [productos, setProductos] = useState([]);
  const { cart, addToCart, clearCart, totalItems, totalPrice } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get('/products');
        setProductos(response.data);
      } catch (err) {
        console.error('Error al traer productos:', err);
      }
    };
    fetchProducts();
  }, []);

  // 🔔 Simulación de pedido mediante alerta interactiva nativa
  const handleCheckout = () => {
    if (cart.length === 0) return;

    alert(`🎉 ¡Pedido Simulado con Éxito! 🎉\n\nHas solicitado ${totalItems} productos por un valor total de $${totalPrice.toLocaleString()} COP.\n\n¡Gracias por tu compra en DOG-GO! ✨`);
    clearCart(); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-50 via-purple-50 to-indigo-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Grilla de productos (Izquierda) */}
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-black text-purple-950 mb-2">Nuestro Catálogo 🛍️</h1>
          <p className="text-gray-500 mb-8 font-medium">Encuentra los mejores productos </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {productos.map((prod) => (
              <div key={prod.id} className="bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow-xl shadow-purple-100/50 border border-purple-100 flex flex-col justify-between">
                <div>
                  {prod.imagen ? (
                    <img 
                      src={`http://localhost:5000${prod.imagen}`} 
                      alt={prod.nombre} 
                      className="w-full h-48 object-cover rounded-2xl mb-4 shadow-sm"
                    />
                  ) : (
                    <div className="w-full h-48 bg-purple-100 rounded-2xl mb-4 flex items-center justify-center text-purple-400 font-bold">Sin foto 🐶</div>
                  )}
                  <h3 className="text-lg font-black text-purple-950 mb-1">{prod.nombre}</h3>
                  <p className="text-gray-400 text-xs font-medium mb-3 line-clamp-2">{prod.descripcion}</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-purple-600 font-black text-base">${parseFloat(prod.precio).toLocaleString()} COP</span>
                  <button
                    onClick={() => addToCart(prod)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold py-2 px-4 rounded-full shadow-md hover:scale-105 transition"
                  >
                    Agregar 🛒
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Barra Flotante Lateral del Carrito (Derecha) */}
        <aside className="w-full lg:w-80 bg-white/90 backdrop-blur-md border-t lg:border-t-0 lg:border-l border-purple-100 p-6 flex flex-col justify-between h-[calc(100vh-80px)] sticky top-20">
          <div>
            <h2 className="text-lg font-black text-purple-950 border-b border-purple-100 pb-3 mb-4 flex items-center gap-2">
              Tu Carrito 🛒 <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">{totalItems}</span>
            </h2>

            {cart.length === 0 ? (
              <p className="text-gray-400 font-medium text-sm text-center py-10">El carrito está vacío. ¡Añade cositas lindas! 🌸</p>
            ) : (
              <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-purple-50/50 border border-purple-100/50 p-2.5 rounded-2xl text-sm">
                    <div>
                      <p className="font-bold text-purple-950 truncate max-w-[140px]">{item.nombre}</p>
                      <p className="text-xs text-gray-400 font-medium">Cant: {item.quantity}</p>
                    </div>
                    <span className="font-black text-purple-700">${(item.precio * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-purple-100 pt-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 text-sm font-bold">Total estimado:</span>
              <span className="text-xl font-black text-purple-950">${totalPrice.toLocaleString()} COP</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className={`w-full py-3 rounded-full font-black text-sm text-white shadow-lg transition ${
                cart.length > 0 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-95 shadow-purple-200' 
                  : 'bg-gray-300 cursor-not-allowed shadow-none'
              }`}
            >
              Simular Pedido 🚀
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}