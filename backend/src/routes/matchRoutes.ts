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

//Ruta para obtener un partido por id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const match = await matchService.getMatchById(id);
    if(!match) {
      return res.status(404).json({ error: 'Partido no encontrado'});
    }
    res.json(match);
  }catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});