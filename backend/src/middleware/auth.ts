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
};

//Middleware para verificar si es admin
export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      message: 'Autenticacion requerida',
      error: 'Unauthorized'
    });
  }

  //importo admin service
  const { AdminService } = await import('../services/AdminService');
  const adminService = new AdminService();

  const isAdmin = await adminService.isAdmin(req.user.userId);
  if(!isAdmin) {
    return res.status(403).json({
      message: 'No tienes permisos para acceder a esta ruta',
      error: 'Forbidden'
    });
  }
  next();
};