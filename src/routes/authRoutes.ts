import express from 'express';
import { adminAuth } from '../config/firebase';
import { User } from '../models/User';
import { generateToken } from '../config/jwt';
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
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error interno del servidor'
    });
  }
});

// Ruta para iniciar sesión / registrarse con Firebase
router.post('/firebase-login', async (req, res) => {
  try {
    const { firebaseToken } = req.body;
    
    if (!firebaseToken) {
      return res.status(400).json({
        success: false,
        message: 'Token de Firebase requerido'
      });
    }

    // Verificar token con Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(firebaseToken);
    
    // Buscar usuario por Firebase UID o email
    let user = await User.findOne({ 
      $or: [
        { firebaseUid: decodedToken.uid },
        { email: decodedToken.email }
      ]
    });

    if (user) {
      // Usuario existe - actualizar Firebase UID si no lo tiene
      if (!user.firebaseUid) {
        user.firebaseUid = decodedToken.uid;
        user.provider = 'google';
        user.avatar = decodedToken.picture;
        await user.save();
      }
    } else {
      // Crear nuevo usuario
      user = new User({
        firebaseUid: decodedToken.uid,
        email: decodedToken.email!,
        nombre: decodedToken.name || 'Usuario Google',
        provider: 'google',
        avatar: decodedToken.picture,
        activo: true
      });
      await user.save();
    }

    // Verificar que el usuario esté activo
    if (!user.activo) {
      return res.status(403).json({
        success: false,
        message: 'El usuario está inactivo'
      });
    }

    // Generar JWT usando tu sistema actual
    const jwtToken = generateToken({
      userId: user._id.toString(),
      email: user.email,
      nombre: user.nombre
    });

    // Respuesta igual que tu login actual
    res.json({
      success: true,
      token: jwtToken,
      userType: 'user',
      user: {
        id: user._id.toString(),
        email: user.email,
        nombre: user.nombre,
        avatar: user.avatar,
        provider: user.provider,
        votosRealizados: user.votosRealizados,
        activo: user.activo
      }
    });

  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: 'Token de Firebase inválido'
    });
  }
});

export default router;