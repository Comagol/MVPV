import express from "express";
import { MatchService } from '../services/MatchService';
import { authenticateToken } from "../middleware/auth";

const router = express.Router();
const matchService = new MatchService();

//RUTAS PUBLICAS
//Ruta para obtener todos los partidos
router.get('/',async(req, res) => {
  try {
    const matches = await matchService.getAllMatches();
    res.json(matches);
  }catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});