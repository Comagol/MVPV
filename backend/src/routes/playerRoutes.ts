import express from "express";
import { PlayerService } from "../services/PlayerService";
import { authenticateToken, isAdmin } from "../middleware/auth";

const router = express.Router();
const playerService = new PlayerService();

//RUTAS PRIVADAS

// Ruta para crear un nuevo jugador
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const playerData = req.body;
    const player = await playerService.createPlayer(playerData);
    res.status(201).json(player);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
})

//Ruta para obtener todos los jugadores
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const players = await playerService.getPlayers();
    res.json(players);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

//Ruta para obtener un jugador por id
router.get('/:id', authenticateToken, isAdmin, async (req,res) => {
  try {
    const { id } = req.params;
    const player = await playerService.getPlayerById(id);
    if(!player) {
      return res.status(404).json({ error: 'Jugador no encontrado'});
    }
    res.json(player);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;