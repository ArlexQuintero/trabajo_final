const db = require('../config/db');

const createOrder = async (req, res) => {
  // Obtenemos una conexión del pool para manejar la transacción manualmente
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { items, total, address, phone } = req.body;
    const userId = req.user.id; // Obtenido desde tu middleware de autenticación

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "El carrito no contiene productos." });
    }

    // 1. Insertar la cabecera del pedido
    const [orderResult] = await connection.query(
      "INSERT INTO orders (user_id, total, address, phone, status) VALUES (?, ?, ?, ?, 'pending')",
      [userId, total, address, phone]
    );
    const orderId = orderResult.insertId;

    // 2. Procesar cada producto, verificar stock y restar unidades
    for (const item of items) {
      // Consultamos el stock actual del producto con bloqueo de lectura (FOR UPDATE)
      const [products] = await connection.query(
        "SELECT stock, name FROM products WHERE id = ? FOR UPDATE", 
        [item.product_id]
      );
      
      if (products.length === 0) {
        throw new Error(`El producto con ID ${item.product_id} no existe.`);
      }

      const product = products[0];

      if (product.stock < item.quantity) {
        throw new Error(`Stock insuficiente para "${product.name}". Disponible: ${product.stock}, Solicitado: ${item.quantity}`);
      }

      // Restar del inventario
      await connection.query(
        "UPDATE products SET stock = stock - ? WHERE id = ?",
        [item.quantity, item.product_id]
      );

      // Guardar el detalle del pedido
      await connection.query(
        "INSERT INTO order_details (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    // Confirmamos los cambios si todo salió bien
    await connection.commit();
    res.status(201).json({ message: "Pedido creado fijamente y stock actualizado.", orderId });

  } catch (error) {
    // Si algo falla, revertimos absolutamente todo
    await connection.rollback();
    res.status(400).json({ error: error.message || "Error al procesar el pedido fijos." });
  } finally {
    connection.release(); // Devolvemos la conexión al pool
  }
};

module.exports = { createOrder };