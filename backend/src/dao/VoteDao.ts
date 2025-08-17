import { Vote, IVote } from "../models/Vote";
import { VoteRequest, VoteStatistics } from "../types/vote.types";

export class VoteDao {

  //Creo un nuevo voto
  async createVote(voteData: VoteRequest): Promise<IVote> {
    const vote = new Vote(voteData);
    return await vote.save();
  }

  //Ontener voto por ID
  async findById(id: string): Promise<IVote | null> {
    return await Vote.findById(id);
  }

  //obtner todos los votos
  async findAll(): Promise<IVote[]> {
    return await Vote.find().sort({ fechaVoto: -1});
  }

  //Verificar si un usuario ya voto en un partido
  async hasVoted(userId: string, matchId: string): Promise<IVote | null> {
    return await Vote.findOne({ userId, matchId});
  }

  //Obtener votos por partido
  async findByMatch(matchId: string): Promise<IVote[]> {
    return await Vote.find({ matchId })
    .populate('userId', 'nombre email')
    .populate('playerId', 'nombre apodo')
    .sort({ fechaVoto: -1 });
  }

  //Obtener votos por usuario
  async findByUser(userId: string): Promise<IVote[]> {
    return await Vote.find({ userId })
    .populate('playerId', 'nombre apodo')
    .populate('matchId', 'fecha')
    .sort({ fechaVoto: -1 });
  }

  // Obtener votos por jugador de un partido especifico⚠️
  async findByPlayerInMatch(matchId: string, playerId: string): Promise<IVote[]> {
    return await Vote.find({ matchId, playerId })
    .populate('userId', 'nombre email')
    .sort({ fechaVoto: -1 })
  }

  //contar votos por jugador en un partido
  async countVotesByPlayerInMatch(matchId: string, playerId: string): Promise<number> {
    return await Vote.countDocuments({ matchId, playerId });
  }

  // obtener estadisticas de votacion de un partido
  async getMatchVotingStats(matchId: string): Promise<VoteStatistics[]> {
    return await Vote.aggregate([
      { $match: { matchId }},
      { $group: {
        _id: '$playerId',
        totalVotos: { $sum: 1 }
      }},
      { $sort: { totalVotos: -1 }},
    ]);
  }

  // obtener estadisticas detalladas con nombres de jugadores
  async getDetailedMatchStats(matchId: string): Promise<any[]> {
    return await Vote.aggregate([
      { $match: { matchId }},
      { $group: {
        _id: '$playerId',
        totalVotos: { $sum: 1 },
        ultimoVoto: { $max: '$fechaVoto' }
      }},
      { $lookup: {
        from: 'players',
        localField: '_id',
        foreignField: '_id',
        as: 'player'
      }},
      { $unwind: '$player' },
      { $project: {
        playerId: '$_id',
        nombre: '$player.nombre',
        apodo: '$player.apodo',
        totalVotos: 1,
        ultimoVoto: 1
      }},
      { $sort: { totalVotos: -1 } }
    ]);
  }

  //obtener el total de votos de un partido
  async getTotalVotes(matchId: string): Promise<number> {
    return await Vote.countDocuments({ matchId });
  }

  //eliminar votos de un partido
  async deleteVotesByMatch(matchId: string): Promise<number> {
    const result = await Vote.deleteMany({ matchId });
    return result.deletedCount || 0;
  }

  // obtener los votos en vivo
  async getLiveVotingStats(matchId: string): Promise<any[]> {
    return await Vote.aggregate([
      { $match: { matchId }},
      { $group: {
        _id: '$playerId',
        totalVotos: { $sum: 1 }
      }},
      { $lookup: {
        from: 'players',
        localField: '_id',
        foreignField: '_id',
        as: 'player'
      }},
      { $unwind: '$player' },
      { $project: {
        playerId: '$_id',
        nombre: '$player.nombre',
        apodo: '$player.apodo',
        totalVotos: 1,
        porcentaje: { $multiply: [{ $divide: ['$totalVotos', { $sum: '$totalVotos' }] }, 100] }
      }},
      { $sort: { totalVotos: -1 } }
    ]);
  }
}
