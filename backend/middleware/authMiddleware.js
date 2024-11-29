const jwt = require('jsonwebtoken');
require('dotenv').config(); // Asegúrate de que dotenv esté configurado

const authenticateUser = (req, res, next) => {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  console.log('Token recibido:', token); // Log del token recibido

  if (!token) {
    console.log('No se proporcionó token'); // Log si no se proporciona token
    return res.status(401).json({ error: 'Autenticación requerida' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Usa la variable de entorno
    console.log('Token decodificado:', decoded); // Log del token decodificado
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = authenticateUser;
