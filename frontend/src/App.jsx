import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext'; 

// Importaciones de Páginas / Vistas Principales 
import HomePage from './src/pages/HomePage';
import ShopPage from './src/pages/ShopPage';
import CartPage from './src/pages/CartPage';
import OrdersPage from './src/pages/OrdersPage';
import AdminPage from './src/pages/AdminPage';
import NotFoundPage from './src/pages/NotFoundPage';

// Componentes de Autenticación
import Login from './src/components/auth/Login';
import Register from './src/components/auth/Register';

// Importación del protector de rutas
import ProtectedRoute from './src/components/common/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* Envolvemos con el proveedor del carrito para que esté disponible en todo el catálogo */}
        <CartProvider>
          <Routes>
            {/* ================= RUTAS PÚBLICAS ================= */}
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ================= RUTAS PROTEGIDAS CLIENTE ================= */}
            {/* Solo usuarios logueados con rol 'client' o 'admin' */}
            <Route element={<ProtectedRoute allowedRoles={['client', 'admin']} />}>
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders" element={<OrdersPage />} />
            </Route>

            {/* ================= RUTAS PROTEGIDAS ADMIN ================= */}
            {/* Únicamente usuarios con rol 'admin' */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>

            {/* ================= RUTA 404 ================= */}
            <Route path="/not-found" element={<NotFoundPage />} />
            {/* Redirecciona cualquier ruta inválida directamente al 404 de forma limpia */}
            <Route path="*" element={<Navigate to="/not-found" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
