import jwt from 'jsonwebtoken';

//configuro JWT
export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'tu_secreto_secreto',
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
  REFRESH_EXPIRES_IN: '7D',
};

// INTERFAZ PARA EL PAYLOAD DEL TOKEN
export interface JWTPayload {
  userId: string;
  email: string;
  nombre: string;
};

// funcion para generar el token
export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_CONFIG.SECRET, {
    expiresIn: JWT_CONFIG.EXPIRES_IN
  });
};

// funcion para verificar el token
export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_CONFIG.SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Token invalido');
  }
};