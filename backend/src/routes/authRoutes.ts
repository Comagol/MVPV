import express from 'express';
import { AuthService } from '../services/AuthService';

const router = express.Router();

//Ruta para iniciar sesion
router.post('/login', async (req, res) => {
  try {
    const authService = new AuthService();
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error interno del servidor'
    });
  }
});

export default router;