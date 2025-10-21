import express from 'express';
import { VoteService } from '../services/VoteService';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = express.Router();
const voteService = new VoteService();

//Ruta para validar si un usuario puede votar
router.get('/validate/:matchId', authenticateToken, async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.user!.userId;
    const validation = await voteService.validateVote(userId, matchId);
    res.status(200).json(validation);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
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

//Ruta para obtener top 3 jugadores más votados
router.get('/:matchId/top3', async (req, res) => {
  try {
    const { matchId } = req.params;
    const top3 = await voteService.getTop3Players(matchId);
    res.status(200).json(top3);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
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

//Ruta para obtener el voto del usuario autenticado
router.get('/:matchId/my-vote', authenticateToken, async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.user!.userId;
    const userVote = await voteService.getUserVote(userId, matchId);
    
    if (!userVote) {
      return res.status(404).json({ error: 'No has votado en este partido' });
    }
    
    res.status(200).json(userVote);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

//Ruta para obtener el historial de votos de un usuario
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const voteHistory = await voteService.getUserVoteHistory(userId);

    if(voteHistory.length === 0) {
      return res.status(200).json({
        message: 'Aun no tienes votos en partidos finalizados',
        history: []
      });
    }

    res.status(200).json({
      message: 'Historial de votos obtenido correctamente',
      history: voteHistory
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


export default router;