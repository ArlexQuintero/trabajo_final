import express from 'express';
import pool from '../config/db.js'; 
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// 1. [GET] Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM productos ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error al traer productos:', error);
    res.status(500).json({ error: 'Error al obtener los productos.' });
  }
});

// 2. [POST] Crear un nuevo producto (Con Stock incluido)
router.post('/', upload.single('imagen'), async (req, res) => {
  // Capturamos el stock que viene desde el FormData
  const { nombre, descripcion, precio, stock } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    if (!nombre || !precio) {
      return res.status(400).json({ error: 'El nombre y el precio son campos obligatorios.' });
    }

    // Si no mandan stock o viene vacío, lo dejamos en 0 por defecto
    const valorStock = (stock !== undefined && stock !== '') ? parseInt(stock, 10) : 0;

    // Insertamos incluyendo la columna stock
    const [result] = await pool.query(
      'INSERT INTO productos (nombre, descripcion, precio, imagen, stock) VALUES (?, ?, ?, ?, ?)',
      [nombre, descripcion, precio, image_url, valorStock]
    );

    res.status(201).json({ message: 'Producto registrado con éxito', id: result.insertId });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error interno al guardar el producto.' });
  }
});

// 3. [PUT] Actualizar un producto existente (Con Stock incluido)
router.put('/:id', upload.single('imagen'), async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, stock } = req.body;

  try {
    const [current] = await pool.query('SELECT imagen FROM productos WHERE id = ?', [id]);
    if (current.length === 0) return res.status(404).json({ error: 'Producto no encontrado.' });

    let imagen_Url = current[0].imagen;
    if (req.file) {
      imagen_Url = `/uploads/${req.file.filename}`;
    }

    const valorStock = (stock !== undefined && stock !== '') ? parseInt(stock, 10) : 0;

    // Actualizamos la columna stock en la base de datos
    await pool.query(
      'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, imagen = ?, stock = ? WHERE id = ?',
      [nombre, descripcion, precio, imagen_Url, valorStock, id]
    );

    res.json({ message: 'Producto actualizado con éxito.' });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error interno al actualizar el producto.' });
  }
});

// 4. [DELETE] Eliminar un producto
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM productos WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Producto no encontrado.' });

    res.json({ message: 'Producto eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar el producto.' });
  }
});

export default router;
