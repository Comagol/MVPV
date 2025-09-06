import express from 'express';
import { AdminService } from '../services/AdminService';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = express.Router();
const adminService = new AdminService();

//RUTAS PUBLICAS
//Ruta para registrar un nuevo admin
router.post('/register', async (req, res) => {
  try {
    const adminData = req.body;
    const admin = await adminService.createAdmin(adminData);
    res.status(201).json({
      message: 'Admin creado correctamente',
      admin
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

//ruta para el login del admin
router.post('/login', async (req, res) => {
  try {
    const credentials = req.body;
    const loginResponse = await adminService.loginAdmin(credentials);
    res.status(200).json({
      message: 'Inicio de sesion exitoso',
      loginResponse
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message});
  }
});

//Rutas Privadas
// Ruta para actualizar la contraseña del admin
router.put('/change-password', authenticateToken, isAdmin, async (req, res) => {
  try {
    const adminId = req.user!.userId;
    const passwordData = req.body;

    const success = await adminService.changePassword(adminId, passwordData);

    if(success) {
      res.status(200).json({
        message: 'Contraseña actualizada correctamente',
        success
      });
    } else {
        res.status(400).json({
          error: 'Error al actualizar la contraseña'
        });
      }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;