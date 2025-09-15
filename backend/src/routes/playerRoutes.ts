import express from "express";
import { PlayerService } from "../services/PlayerService";
import { authenticateToken, isAdmin } from "../middleware/auth";

const router = express.Router();
const playerService = new PlayerService();

//RUTAS PRIVADAS
//Ruta para obtener todos los jugadores
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const players = await playerService.getPlayers();
    res.json(players);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});