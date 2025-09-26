import express from 'express';
import { UserService } from '../services/UserService';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = express.Router();
const userService = new UserService();

//RUTAS PUBLICAS
//Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
  try {
    const userData = req.body;
    const user = await userService.createUser(userData);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});


//RUTAS DE ADMIN (con autenticacion)
router.get('/', authenticateToken, isAdmin, async(req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

//Ruta para obtener un usuario por id y activarlo
router.put('/:id/activate', authenticateToken, isAdmin, async(req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.activateUser(id);
    if(!user) {
      return res.status(404).json({ error: 'Usuario no encontrado'});
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

//Ruta para obtener un usuario por id y desactivarlos
router.put('/:id/deactivate', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.desactiveUser(id);
    if(!user) {
      return res.status(404).json({ error: 'Usuario no encontrado'});
    }
    res.json(user);
  }catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
