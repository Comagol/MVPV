import express from 'express';
import { UserService } from '../services/UserService';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const userService = new UserService();

//RUTAS PUBLICAS
//Ruta para registrar un nuevo usuario
router.post('register', async (req, res) => {
  try {
    const userData = req.body;
    const user = await userService.createUser(userData);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

