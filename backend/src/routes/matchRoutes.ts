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

//ruta para obtener partidos activos
router.get('/active/matches', async (req, res) => {
  try {
    const activeMatches = await matchService.getActiveMatches();
    res.json(activeMatches);
  }catch (error: any) {
    res.status(500).json({ error: error.message});
  }
});

//RUTAS PROTEGIDAS (solo admin)
//Ruta para crear un nuevo partido
router.post('/', authenticateToken, async (req, res) => {
  try {
    const matchData = req.body;
    const match = await matchService.createMatch(matchData);
    res.status(201).json({message: 'Partido creado correctamente', match});
  }catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

//Ruta para actualizar un partida
router.put('/:id', authenticateToken, async (req, res) =>{
  try {
    const { id } = req.params;
    const updateData = req.body;
    const match = await matchService.updateMatch(id, updateData);
    
    if(!match) {
      return res.status(404).json({ error: 'Partido no encontrado' });
    }
    res.json({message: 'Partido actualizado correctamente', match});
    
  }catch (error: any) {
    res.status(400).json({ error: error.message});
  }
});

//ruta para iniciar un partido
router.put('/:id/start', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const match = await matchService.startMatch(id);
    if(!match) {
      return res.status(404).json({ error: 'Partido no encontrado'});
    }
    res.json({message: 'Partido iniciado correctamente', match});
  }catch (error:any) {
    res.status(400).json({ error: error.message});
  }
});

//Ruta para finalizar un partido
router.put('/:id/finish', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const match = await matchService.finishMatch(id);
    if(!match) {
      return res.status(404).json({ error: 'Partido no encontrado'});
    }
    res.json({ message: 'Partido finalizado correctamente', match});
  }catch (error: any) {
    res.status(400).json({ error: error.message});
  }
});