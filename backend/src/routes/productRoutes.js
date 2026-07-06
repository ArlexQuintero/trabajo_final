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

// 2. [POST] Crear un nuevo producto
router.post('/', upload.single('imagen'), async (req, res) => {
  // 1. Recibimos las variables tal como las manda el frontend (FormData)
  const { nombre, descripcion, precio } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    // 2. Validamos con las variables correctas
    if (!nombre || !precio) {
      return res.status(400).json({ error: 'El nombre y el precio son campos obligatorios.' });
    }

    // 3. Insertamos en las columnas de la DB: (nombre, descripcion, precio, imagen)
    const [result] = await pool.query(
      'INSERT INTO productos (nombre, descripcion, precio, imagen) VALUES (?, ?, ?, ?)',
      [nombre, descripcion, precio, image_url]
    );

    res.status(201).json({ message: 'Producto registrado con éxito', id: result.insertId });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error interno al guardar el producto.' });
  }
});

// 3. [PUT] Actualizar un producto existente
router.put('/:id', upload.single('imagen'), async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio } = req.body;

  try {
    const [current] = await pool.query('SELECT imagen FROM productos WHERE id = ?', [id]);
    if (current.length === 0) return res.status(404).json({ error: 'Producto no encontrado.' });

    let imagen_Url = current[0].imagen;
    if (req.file) {
      imagen_Url = `/uploads/${req.file.filename}`;
    }

    await pool.query(
      'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, imagen = ? WHERE id = ?',
      [nombre, descripcion, precio, imagen_Url, id]
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
