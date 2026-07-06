const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const db = require('../config/db'); 

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Validar que vengan los campos obligatorios
    if (!email || !password) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // 2. Buscar al usuario en la base de datos (con promesas o callback tradicional)
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Credenciales incorrectas' });
    }

    const user = rows[0];

    // 3. Comparar las contraseñas usando Bcrypt
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Credenciales incorrectas' });
    }

    // 4. Generar Token JWT incluyendo el rol
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secretkey_placeholder',
      { expiresIn: '2h' }
    );

    // 5. Responder al frontend con el objeto exacto que espera tu Login.jsx
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role 
      }
    });

  } catch (error) {
    console.error('Error en el login backend:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;