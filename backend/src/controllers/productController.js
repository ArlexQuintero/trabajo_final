const db = require('../config/db');

// Obtener todos los productos
exports.getProducts = (req, res) => {
  const query = 'SELECT * FROM products';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener productos:', err);
      return res.status(500).json({ error: 'Error interno del servidor al obtener productos.' });
    }
    res.json(results);
  });
};

// Crear un nuevo producto (con imagen)
exports.createProduct = (req, res) => {
  const { nombre, descripcion, precio } = req.body;
  
  // Si se subió un archivo, guardamos la ruta relativa, de lo contrario dejamos null
  const imagen = req.file ? `/uploads/${req.file.filename}` : null;

  if (!nombre || !precio) {
    return res.status(400).json({ error: 'El nombre y el precio son obligatorios.' });
  }

  const query = 'INSERT INTO products (nombre, descripcion, precio, imagen) VALUES (?, ?, ?, ?)';
  db.query(query, [nombre, descripcion, precio, imagen], (err, result) => {
    if (err) {
      console.error('Error al insertar producto:', err);
      return res.status(500).json({ error: 'Error al registrar el producto en la base de datos.' });
    }
    res.status(201).json({ message: 'Producto creado con éxito', id: result.insertId });
  });
};

// Actualizar un producto existente
exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio } = req.body;
  
  // Buscamos si viene una nueva imagen
  let query = 'UPDATE products SET nombre = ?, descripcion = ?, precio = ?';
  let params = [nombre, descripcion, precio];

  if (req.file) {
    const imagen = `/uploads/${req.file.filename}`;
    query += ', imagen = ?';
    params.push(imagen);
  }

  query += ' WHERE id = ?';
  params.push(id);

  db.query(query, params, (err, result) => {
    if (err) {
      console.error('Error al actualizar producto:', err);
      return res.status(500).json({ error: 'Error al actualizar el producto.' });
    }
    res.json({ message: 'Producto actualizado con éxito' });
  });
};

// Eliminar un producto
exports.deleteProduct = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM products WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar producto:', err);
      return res.status(500).json({ error: 'No se pudo eliminar el producto.' });
    }
    res.json({ message: 'Producto eliminado correctamente' });
  });
};