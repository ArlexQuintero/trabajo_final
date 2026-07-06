import { createContext, useState } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Añadir un producto al carrito o incrementar su cantidad
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Limpiar el carrito completo
  const clearCart = () => setCart([]);

  // Calcular el total de artículos
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Calcular el precio total
  const totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.precio, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}