import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./src/context/AuthContext";
import { CartProvider } from "./src/context/CartContext";

// Importaciones de Páginas / Vistas Principales
import HomePage from "./src/pages/HomePage";
import ShopPage from "./src/pages/ShopPage";
import CartPage from "./src/pages/CartPage";
import OrdersPage from "./src/pages/OrdersPage";
import AdminPage from "./src/pages/AdminPage";
import NotFoundPage from "./src/pages/NotFoundPage";

// 🔥 NUEVA IMPORTACIÓN: El componente del Dashboard del Admin
import HomeAdmin from "./src/pages/HomeAdmin";
import AdminProducts from "./src/components/admin/AdminProducts";
import AdminDashboard from "./src/components/admin/AdminDashboard";
import AdminUsers from "./src/components/admin/AdminUsers";

// Componentes de Autenticación
import Login from "./src/components/auth/Login";
import Register from "./src/components/auth/Register";

// Importación del protector de rutas
import ProtectedRoute from "./src/components/common/ProtectedRoute";

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
            <Route
              element={<ProtectedRoute allowedRoles={["client", "admin"]} />}
            >
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders" element={<OrdersPage />} />
            </Route>

            {/* ================= RUTAS PROTEGIDAS ADMIN ================= */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<AdminPage />}>
                {/* Carga por defecto el gráfico y KPIs */}
                <Route index element={<HomeAdmin />} />
                {/* Rutas secundarias para la gestión de productos y pedidos */}
                <Route path="products" element={<AdminProducts />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="catalogo" element={<ShopPage />} />
              </Route>
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
