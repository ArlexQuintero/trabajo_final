import express from 'express';
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken';
import db from '../config/db.js'; 

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log("=== INTENTO DE LOGIN ===");
  console.log("Datos recibidos en el body:", req.body);

  try {
    if (!email || !password) {
      console.log("❌ Fallo: Email o password vacíos");
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Ejecutamos tolerando si la db usa promesas nativas o tradicional
    const result = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    const rows = Array.isArray(result[0]) ? result[0] : result;

    console.log("Resultado de la búsqueda en DB (filas encontradas):", rows ? rows.length : 0);

    if (!rows || rows.length === 0) {
      console.log("❌ Fallo: No se encontró ningún usuario con ese email");
      return res.status(400).json({ error: 'Credenciales incorrectas' });
    }

    const user = rows[0];
    console.log("Usuario encontrado en DB:", { id: user.id, email: user.email, role: user.role});

    console.log("Comparando password ingresada con hash de DB...");
    const match = await bcrypt.compare(password, user.password);
    console.log("¿La contraseña coincide?:", match);

    if (!match) {
      console.log("❌ Fallo: La contraseña no coincide con el hash");
      return res.status(400).json({ error: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secretkey_placeholder',
      { expiresIn: '2h' }
    );

    console.log("✅ Login Exitoso para:", user.email);

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
    console.error('💥 ERROR CRÍTICO EN EL LOGUEO:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
