import express from 'express';
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken';
import db from '../config/db.js'; 

const router = express.Router();

// ==========================================
// 1. POST /api/auth/register (SOLUCIÓN DE COLUMNAS)
// ==========================================
router.post('/register', async (req, res) => {
  // Recibimos los datos del frontend
  const { name, email, password, phone, address } = req.body;

  console.log("=== INTENTO DE REGISTRO ===");
  console.log("Datos recibidos para registrar:", req.body);

  try {
    if (!name || !email || !password) {
      console.log("❌ Fallo: Campos obligatorios vacíos (name, email o password)");
      return res.status(400).json({ error: 'El nombre, email y contraseña son obligatorios' });
    }

    console.log("Encriptando la contraseña...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 🔥 CORRECCIÓN AQUÍ: Usamos exactamente las columnas que existen en tu tabla MySQL
    // Nota: Como 'phone' (teléfono) y 'address' (dirección) no están en tu lista de columnas,
    // los omitimos en el INSERT para que no rompa la base de datos.
    const query = `
      INSERT INTO usuarios (name, email, password, role) 
      VALUES (?, ?, ?, 'user')
    `;

    console.log("Insertando usuario en la base de datos...");
    // Pasamos solo los valores de las columnas existentes
    const [result] = await db.query(query, [name, email, hashedPassword]);

    console.log("✅ Usuario registrado con éxito. ID insertado:", result.insertId);
    return res.status(201).json({ 
      message: 'Usuario registrado con éxito', 
      id: result.insertId 
    });

  } catch (error) {
    console.error('💥 ERROR CRÍTICO EN EL REGISTRO:', error.message);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    return res.status(500).json({ error: 'Error interno del servidor al crear la cuenta' });
  }
});


// ==========================================
// 2. POST /api/auth/login (TU ENDPOINT ACTUAL)
// ==========================================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log("=== INTENTO DE LOGIN ===");
  console.log("Datos recibidos en el body:", req.body);

  try {
    if (!email || !password) {
      console.log("❌ Fallo: Email o password vacíos");
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

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
        name: user.nombre, // Cambiado user.name por user.nombre que es como se llama en tu INSERT
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