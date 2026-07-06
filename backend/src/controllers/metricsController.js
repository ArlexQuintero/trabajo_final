import db from '../config/db.js';

export const getDashboardMetrics = async (req, res) => {
  try {
    // 1. Cantidad total de productos registrados en la tabla 'productos'
    const [productsQuery] = await db.query("SELECT COUNT(*) as totalProducts FROM productos");
    const totalProducts = productsQuery[0].totalProducts || 0;

    // 2. Cantidad total de usuarios registrados en la tabla 'usuarios'
    // Nota: Si tu tabla de usuarios se llama 'users', cambia 'usuarios' por 'users' abajo
    const [usersQuery] = await db.query("SELECT COUNT(*) as totalUsers FROM usuarios");
    const totalUsers = usersQuery[0].totalUsers || 0;

    // 3. Cantidad en plata del valor de los productos agregados (Precio * Stock)
    const [valueQuery] = await db.query("SELECT SUM(precio * stock) as totalInventoryValue FROM productos");
    const totalInventoryValue = valueQuery[0].totalInventoryValue || 0;

    // Enviamos los datos limpios al frontend
    res.status(200).json({
      totalProducts,
      totalUsers,
      totalInventoryValue: parseFloat(totalInventoryValue)
    });

  } catch (error) {
    console.error("Error al obtener las métricas simplificadas:", error);
    res.status(500).json({ error: "Error al compilar las métricas del servidor." });
  }
};