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