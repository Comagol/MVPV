import express from 'express';
import { VoteService } from '../services/VoteService';
import { authenticateToken, isAdmin } from '../middleware/auth';
import { match } from 'assert';

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

//Ruta para obtener al ganador de un partido
router.get('/:matchId/winner', async (req, res) => {
  try {
    const { matchId } = req.params;
    const winner = await voteService.getMatchWinner(matchId);

    if(!winner) {
      return res.status(404).json({ error: 'No hay ganador para este partido'});
    }
    res.status(200).json(winner);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

//Ruta para obtener el total de votos de un partido
router.get('/:matchId/total-votes', async (req, res) => {
  try {
    const { matchId } = req.params;
    const totalVotes = await voteService.getTotalVotes(matchId);
    res.status(200).json({ totalVotes});
  } catch (error:any) {
    res.status(500).json({ error: error.message});
  }
});

//Rutas para usuarios autenticados
//Ruta para crear un voto
router.post('/', authenticateToken, async (req, res) => {
  try {
    const voteData = req.body;
    const userId = req.user!.userId;

    const vote = await voteService.createVote(voteData, userId);
    res.status(201).json({
      message: 'Voto registrado correctamente',
      vote,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

