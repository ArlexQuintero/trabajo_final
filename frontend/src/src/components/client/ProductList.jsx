import { useState, useEffect, useContext } from 'react';
import apiClient from '../../api/apiClient';
import { CartContext } from '../../context/CartContext';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error cargando productos', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Nuestros Productos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
            <img src={product.image_url || 'https://via.placeholder.com/150'} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
              <p className="text-gray-600 text-sm my-2 line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-xl font-extrabold text-blue-600">${product.price}</span>
                <button onClick={() => addToCart(product)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium">Agregar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}