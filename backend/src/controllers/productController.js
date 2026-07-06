const db = require('../config/db');

// Obtener todos los productos
exports.getProducts = (req, res) => {
  const query = 'SELECT * FROM productos'; 
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener productos:', err);
      return res.status(500).json({ error: 'Error interno del servidor al obtener productos.' });
    }
    res.json(results);
  });
};

// Crear un nuevo producto
exports.createProduct = (req, res) => {
  // Capturamos las variables del cuerpo de la petición
  const { nombre, descripcion, precio, stock } = req.body;
  const imagen = req.file ? `/uploads/${req.file.filename}` : null;

  // Validación flexible: si no viene el stock o es un string vacío, le asignamos 0 por defecto
  const valorStock = (stock !== undefined && stock !== '') ? parseInt(stock, 10) : 0;
  const valorPrecio = parseFloat(precio);

  if (!nombre || isNaN(valorPrecio)) {
    return res.status(400).json({ error: 'El nombre y el precio válidos son obligatorios.' });
  }

  const query = 'INSERT INTO productos (nombre, descripcion, precio, imagen, stock) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [nombre, descripcion, valorPrecio, imagen, valorStock], (err, result) => {
    if (err) {
      console.error('Error al insertar producto en DB:', err);
      return res.status(500).json({ error: 'Error al registrar el producto en la base de datos.' });
    }
    res.status(201).json({ message: 'Producto creado con éxito', id: result.insertId });
  });
};

// Actualizar un producto existente
exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, stock } = req.body;
  
  const valorStock = (stock !== undefined && stock !== '') ? parseInt(stock, 10) : 0;
  const valorPrecio = parseFloat(precio);

  let query = 'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?';
  let params = [nombre, descripcion, valorPrecio, valorStock];

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
  const query = 'DELETE FROM productos WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar producto:', err);
      return res.status(500).json({ error: 'No se pudo eliminar el producto.' });
    }
    res.json({ message: 'Producto eliminado correctamente' });
  });
};
