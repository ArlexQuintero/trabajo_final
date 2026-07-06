import { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import apiClient from '../../api/apiClient';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal } = useContext(CartContext);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    // Mapear los ítems al formato requerido por el endpoint POST /api/orders
    const items = cart.map(item => ({
      producto_id: item.id,
      cantidad: item.quantity,
      precio_unitario: item.price
    }));

    try {
      await apiClient.post('/orders', {
        total: getCartTotal(),
        items
      });
      alert('¡Pedido realizado con éxito!');
      clearCart();
    } catch (error) {
        console.error('Error al procesar el pedido', error);
      alert('Error al procesar el pedido');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Tu Carrito de Compras</h2>
      {cart.length === 0 ? (
        <p className="text-gray-500">El carrito está vacío.</p>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          {cart.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row justify-between items-center border-b py-4 gap-4">
              <div>
                <h4 className="font-semibold text-lg">{item.name}</h4>
                <p className="text-gray-500 text-sm">${item.price} c/u</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 bg-gray-200 rounded">-</button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
                <button onClick={() => removeFromCart(item.id)} className="ml-4 text-red-500 text-sm hover:underline">Eliminar</button>
              </div>
              <span className="font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="mt-6 flex justify-between items-center font-bold text-xl">
            <span>Total:</span>
            <span className="text-blue-600">${getCartTotal().toFixed(2)}</span>
          </div>
          <button onClick={handleCheckout} className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-md transition">Confirmar Pedido</button>
        </div>
      )}
    </div>
  );
}