import { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';

export default function AdminProducts() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estado de edición e inputs
  const [editingProductId, setEditingProductId] = useState(null);
  const [prodNombre, setProdNombre] = useState('');
  const [prodDescripcion, setProdDescripcion] = useState('');
  const [prodPrecio, setProdPrecio] = useState('');
  const [prodStock, setProdStock] = useState(''); // Recuperado
  const [imagenFile, setImagenFile] = useState(null);

  // Captura de errores en caliente
  const [errors, setErrors] = useState({
    nombre: '',
    precio: '',
    stock: '' // Recuperado
  });

  const validateField = (field, value) => {
    let errorMsg = '';
    if (field === 'nombre' && !value.trim()) {
      errorMsg = 'El nombre del producto es obligatorio.';
    }
    if (field === 'precio') {
      if (!value) errorMsg = 'El precio es obligatorio.';
      else if (isNaN(value) || Number(value) <= 0) errorMsg = 'Debe ser un número mayor a 0.';
    }
    if (field === 'stock') {
      if (value === '' || value === undefined) errorMsg = 'El stock inicial es obligatorio.';
      else if (isNaN(value) || Number(value) < 0) errorMsg = 'El stock no puede ser negativo.';
    }
    setErrors(prev => ({ ...prev, [field]: errorMsg }));
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.get('/products');
      setProductos(response.data);
    } catch (error) {
      console.error('Error al cargar los productos:', error);
      setError('No se pudieron cargar los productos.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    if (isFormInvalid) return;

    setError('');
    setSuccess('');
    const token = localStorage.getItem('token');

    // Mapeamos los datos en orden para evitar bugs con Multer
    const formData = new FormData();
    formData.append('nombre', prodNombre);
    formData.append('descripcion', prodDescripcion);
    formData.append('precio', prodPrecio);
    formData.append('stock', prodStock); // Agregado
    if (imagenFile) formData.append('imagen', imagenFile);

    try {
      if (editingProductId) {
        await apiClient.put(`/products/${editingProductId}`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        setSuccess('¡Producto actualizado con éxito!');
        setEditingProductId(null);
      } else {
        await apiClient.post('/products', formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        setSuccess('¡Producto registrado con éxito!');
      }

      setProdNombre('');
      setProdDescripcion('');
      setProdPrecio('');
      setProdStock(''); 
      setImagenFile(null);
      setErrors({ nombre: '', precio: '', stock: '' });
      document.getElementById('fileInput').value = ''; 
      fetchProducts();
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      setError('Error al guardar el producto.');
    }
  };

  const handleEditInit = (prod) => {
    setEditingProductId(prod.id);
    setProdNombre(prod.nombre);
    setProdDescripcion(prod.descripcion);
    setProdPrecio(prod.precio);
    setProdStock(prod.stock !== undefined ? prod.stock : ''); // Agregado
    setErrors({ nombre: '', precio: '', stock: '' }); 
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto? 🐶')) return;
    const token = localStorage.getItem('token');
    try {
      await apiClient.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      alert('No se pudo eliminar el producto.');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const isFormInvalid = errors.nombre || errors.precio || errors.stock || !prodNombre || !prodPrecio || prodStock === '';

  return (
    <div className="animate-fadeIn grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Tabla de Inventario */}
      <div className="lg:col-span-2">
        <h1 className="text-3xl font-black text-purple-950 mb-2">Inventario de Productos 📦</h1>
        <p className="text-gray-500 mb-6 font-medium">Gestiona los artículos visibles en el catálogo comercial.</p>

        {error && <p className="bg-pink-100 text-pink-700 p-3 rounded-xl mb-4 text-xs font-bold">{error}</p>}

        {loading ? (
          <p className="text-purple-600 font-bold text-sm animate-pulse">Cargando inventario...</p>
        ) : (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-purple-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-purple-50 text-purple-950 text-xs font-black uppercase tracking-wider border-b border-purple-100">
                  <th className="px-4 py-4">Miniatura</th>
                  <th className="px-4 py-4">Nombre</th>
                  <th className="px-4 py-4">Precio</th>
                  <th className="px-4 py-4 text-center">Stock</th>
                  <th className="px-4 py-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-medium divide-y divide-purple-50">
                {productos.map((p) => (
                  <tr key={p.id} className="hover:bg-purple-50/50 transition">
                    <td className="px-4 py-2">
                      {p.imagen ? (
                        <img src={`http://localhost:5000${p.imagen}`} alt="" className="w-12 h-12 object-cover rounded-xl border border-purple-100" />
                      ) : (
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-xs text-purple-400">🐶</div>
                      )}
                    </td>
                    <td className="px-4 py-2 font-bold text-purple-950">{p.nombre}</td>
                    <td className="px-4 py-2 text-purple-600">${parseFloat(p.precio).toLocaleString()}</td>
                    <td className="px-4 py-2 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.stock < 5 ? 'bg-pink-100 text-pink-700' : 'bg-purple-100 text-purple-700'}`}>
                        {p.stock !== undefined ? p.stock : 0} u.
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => handleEditInit(p)} className="text-amber-500 font-bold text-xs hover:underline">Editar ✏️</button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="text-pink-600 font-bold text-xs hover:underline">Eliminar ❌</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Formulario Lateral Unificado */}
      <div className="bg-white/70 backdrop-blur-md border p-6 rounded-3xl shadow-xl h-fit">
        <h3 className="text-lg font-black text-purple-950 mb-1">{editingProductId ? 'Modificar Producto ✏️' : 'Nuevo Producto ✨'}</h3>
        <p className="text-xs text-gray-400 mb-4">Ingresa la información y sube la foto correspondiente.</p>
        {success && <p className="bg-emerald-100 text-emerald-700 p-2.5 rounded-xl mb-4 text-xs font-bold text-center">{success}</p>}

        <form onSubmit={handleSubmitProduct} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-purple-950 mb-1">Nombre</label>
            <input 
              type="text" 
              value={prodNombre} 
              onChange={(e) => { setProdNombre(e.target.value); validateField('nombre', e.target.value); }} 
              className={`w-full px-3 py-2 border rounded-xl text-sm transition-colors ${errors.nombre ? 'border-pink-500 bg-pink-50/30' : 'border-purple-100'}`} 
              placeholder="Ej: Pastel de Fresa" 
              required 
            />
            {errors.nombre && <p className="text-pink-600 text-[11px] font-bold mt-1 pl-1">{errors.nombre}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-purple-950 mb-1">Descripción</label>
            <textarea value={prodDescripcion} onChange={(e) => setProdDescripcion(e.target.value)} className="w-full px-3 py-2 border border-purple-100 rounded-xl text-sm h-20 resize-none" placeholder="Detalles del artículo..." />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-purple-950 mb-1">Precio (COP)</label>
              <input 
                type="number" 
                value={prodPrecio} 
                onChange={(e) => { setProdPrecio(e.target.value); validateField('precio', e.target.value); }} 
                className={`w-full px-3 py-2 border rounded-xl text-sm transition-colors ${errors.precio ? 'border-pink-500 bg-pink-50/30' : 'border-purple-100'}`} 
                placeholder="25000" 
                required 
              />
              {errors.precio && <p className="text-pink-600 text-[11px] font-bold mt-1 pl-1">{errors.precio}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-950 mb-1">Stock Disponible</label>
              <input 
                type="number" 
                value={prodStock} 
                onChange={(e) => { setProdStock(e.target.value); validateField('stock', e.target.value); }} 
                className={`w-full px-3 py-2 border rounded-xl text-sm transition-colors ${errors.stock ? 'border-pink-500 bg-pink-50/30' : 'border-purple-100'}`} 
                placeholder="10" 
                required 
              />
              {errors.stock && <p className="text-pink-600 text-[11px] font-bold mt-1 pl-1">{errors.stock}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-purple-950 mb-1">Imagen del Producto</label>
            <input id="fileInput" type="file" accept="image/*" onChange={(e) => setImagenFile(e.target.files[0])} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" />
          </div>
          <button 
            type="submit" 
            disabled={isFormInvalid}
            className={`w-full font-bold py-2.5 rounded-full text-sm mt-2 shadow-md transition-all ${isFormInvalid ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'}`}
          >
            {editingProductId ? 'Guardar Cambios' : 'Registrar Producto 🚀'}
          </button>
        </form>
      </div>
    </div>
  );
}
