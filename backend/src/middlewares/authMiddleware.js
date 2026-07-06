import jwt from 'jsonwebtoken';

// Verificar si el usuario está logueado (Cualquier perfil válido)
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta_aqui');
    req.user = verified; 
    next(); 
  } catch (error) {
    res.status(403).json({ error: 'Token inválido o expirado.' });
  }
};

// Verificar si el usuario es Administrador
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de Administrador.' });
  }
};