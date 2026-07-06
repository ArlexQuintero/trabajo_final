import express from "express";
import pool from "../config/db.js";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 1. [POST] /api/orders - Crear un pedido (Permite Cliente y Admin con sesión activa)
router.post("/", verifyToken, async (req, res) => {
  const { total, items } = req.body; 
  const usuario_id = req.user.id;

  try {
    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ error: "No puedes generar un pedido sin productos." });
    }

    // Crear registro maestro de la orden
    const [orderResult] = await pool.query(
      'INSERT INTO pedidos (usuario_id, total, status) VALUES (?, ?, "pendiente")',
      [usuario_id, total],
    );
    const pedido_id = orderResult.insertId;

    // Insertar cada producto del carrito en el detalle del pedido
    for (let item of items) {
      await pool.query(
        "INSERT INTO detalles_pedido (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)",
        [pedido_id, item.producto_id, item.cantidad, item.precio_unitario],
      );
    }

    res
      .status(201)
      .json({ message: "¡Pedido simulado con éxito! 🐶🛒", pedido_id });
  } catch (error) {
    console.error("Error al crear pedido:", error);
    res.status(500).json({ error: error.message });
  }
});

// 2. [GET] /api/orders/user - Pedidos del cliente/admin autenticado
router.get("/user", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY id DESC",
      [req.user.id],
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. [GET] /api/orders - Obtener todos los pedidos globales (SOLO ADMIN)
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    // Sincronizado: u.nombre (asumiendo que tu tabla usuarios tiene columna 'nombre')
    const [rows] = await pool.query(
      "SELECT p.*, u.nombre as cliente FROM pedidos p JOIN usuarios u ON p.usuario_id = u.id ORDER BY p.id DESC",
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. [GET] /api/orders/:id - Obtener detalle completo de un pedido específico
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const [pedido] = await pool.query("SELECT * FROM pedidos WHERE id = ?", [
      req.params.id,
    ]);
    if (pedido.length === 0)
      return res.status(404).json({ error: "Pedido no encontrado" });

    // Sincronizado con tus columnas reales de la tabla productos: pr.nombre y pr.imagen
    const [detalles] = await pool.query(
      "SELECT d.*, pr.nombre, pr.imagen FROM detalles_pedido d JOIN productos pr ON d.producto_id = pr.id WHERE d.pedido_id = ?",
      [req.params.id],
    );

    res.json({ pedido: pedido[0], detalles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. [PUT] /api/orders/:id/status - Cambiar estado del pedido (SOLO ADMIN)
router.put("/:id/status", verifyToken, isAdmin, async (req, res) => {
  const { status } = req.body;
  try {
    await pool.query("UPDATE pedidos SET status = ? WHERE id = ?", [
      status,
      req.params.id,
    ]);
    res.json({ message: "Estado del pedido actualizado correctamente ✨" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
