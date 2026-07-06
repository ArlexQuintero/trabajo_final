import express from 'express';
import { getDashboardMetrics } from '../controllers/metricsController.js';

const router = express.Router();

// Definimos la ruta para obtener los datos del dashboard
// Al combinarse con el prefijo en el index, la URL final será: GET /api/admin/metrics/dashboard
router.get('/dashboard', getDashboardMetrics);

export default router;
