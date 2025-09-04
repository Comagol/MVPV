import express from 'express';
import { VoteService } from '../services/VoteService';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = express.Router();
const voteService = new VoteService();

//Ruta Publica
//Ruta para obtener las estadisticas de votos de un partido
router.get('/:matchId/stats', async (req, res) => {
  try { 
    const { matchId } = req.params;
    const stats = await voteService.getMatchVoteStatistics(matchId);
    res.status(200).json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});