import express from 'express';
import pool from '../config/db.js';
import bcrypt from 'bcryptjs'; // <-- ¡Importante para encriptar la contraseña!
import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// [GET] /api/users - Ver todos los usuarios (SOLO ADMIN)
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, role, created_at FROM usuarios');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔥 [POST] /api/users - Crear un nuevo usuario desde el panel (SOLO ADMIN)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // 1. Validaciones básicas
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // 2. Comprobar si el correo ya existe en el sistema
    const [existing] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    // 3. Encriptar la contraseña de forma segura
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Insertar nuevo usuario en la base de datos
    await pool.query(
      'INSERT INTO usuarios (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'client']
    );

    return res.status(201).json({ message: 'Usuario creado con éxito por el administrador' });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// [GET] /api/users/:id - Detalle de un usuario (SOLO ADMIN)
router.get('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, role, created_at FROM usuarios WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;