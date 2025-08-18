import { Request, Response, NextFunction } from "express";
import { verifyToken, JWTPayload } from "../config/jwt";

//extiendo la interfaz Request para incluir el usuario
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

//Middleware de autenticacion para verificar el token
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'Token de acceso requerido',
      error: 'Unauthorized'
    });
  }

  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch(error){
    return res.status(403).json({
      message: 'Token invalido',
      error: 'Forbidden'
    });
  }
}