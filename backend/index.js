import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importación de enrutadores
import authRoutes from './src/routes/authRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import metricsRoutes from './src/routes/metricsRoutes.js'; // 🔥 NUEVO: Enrutador para el Dashboard

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globales obligatorios
app.use(cors());
app.use(express.json());
// Habilita que Express entienda los datos enviados a través de FormData de forma correcta
app.use(express.urlencoded({ extended: true }));

// 🔥 CRUCIAL: Servir de manera estática y pública la carpeta donde multer guarda los archivos
app.use('/uploads', express.static('uploads'));

// Inyección de Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin/metrics', metricsRoutes);

app.get('/', (req, res) => {
  res.send('API e-commerce corriendo perfectamente y protegida 🚀');
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en http://localhost:${PORT}`);
});
