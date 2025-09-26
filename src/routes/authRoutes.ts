import express from 'express';
import { AuthService } from '../services/AuthService';
import { UserService } from '../services/UserService';

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

// Ruta para solicitar recuperación de contraseña
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validar que se envíe el email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'El email es requerido'
      });
    }

    const userService = new UserService();
    await userService.requestPasswordReset(email);
    
    res.status(200).json({
      success: true,
      message: 'Si el email está registrado, recibirás un enlace de recuperación'
    });
  } catch (error: any) {
    console.error('Error en forgot-password:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error interno del servidor'
    });
  }
});

// Ruta para verificar si un token de recuperación es válido
router.get('/verify-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token es requerido'
      });
    }

    const userService = new UserService();
    const result = await userService.verifyResetToken(token);
    
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error: any) {
    console.error('Error en verify-reset-token:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Ruta para resetear la contraseña
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    // Validar que se envíen los datos requeridos
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token y nueva contraseña son requeridos'
      });
    }

    // Validar longitud mínima de contraseña
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 8 caracteres'
      });
    }

    const userService = new UserService();
    await userService.resetPassword(token, newPassword);
    
    res.status(200).json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error: any) {
    console.error('Error en reset-password:', error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error interno del servidor'
    });
  }
});

export default router;