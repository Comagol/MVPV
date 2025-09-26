import mongoose from "mongoose";
import { Vote, IVote } from "../models/Vote";
import { VoteRequest, VoteStatistics, UserVoteResponse, WinnerResponse } from "../types/vote.types";

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
    return await Vote.findOne({ userId: new mongoose.Types.ObjectId(userId), matchId: new mongoose.Types.ObjectId(matchId)});
  }

  //Obtener votos por partido
  async findByMatch(matchId: string): Promise<IVote[]> {
    return await Vote.find({ matchId: new mongoose.Types.ObjectId(matchId) })
    .populate('userId', 'nombre email')
    .populate('playerId', 'nombre apodo')
    .sort({ fechaVoto: -1 });
  }

  //Obtener votos por usuario
  async findByUser(userId: string): Promise<IVote[]> {
    return await Vote.find({ userId: new mongoose.Types.ObjectId(userId) })
    .populate('playerId', 'nombre apodo')
    .populate('matchId', 'fecha')
    .sort({ fechaVoto: -1 });
  }

  // Obtener votos por jugador de un partido especifico⚠️
  async findByPlayerInMatch(matchId: string, playerId: string): Promise<IVote[]> {
    return await Vote.find({ matchId: new mongoose.Types.ObjectId(matchId), playerId: new mongoose.Types.ObjectId(playerId) })
    .populate('userId', 'nombre email')
    .sort({ fechaVoto: -1 })
  }

  //contar votos por jugador en un partido
  async countVotesByPlayerInMatch(matchId: string, playerId: string): Promise<number> {
    return await Vote.countDocuments({ 
      matchId: new mongoose.Types.ObjectId(matchId), 
      playerId: new mongoose.Types.ObjectId(playerId) 
    });
  }
  // obtener estadisticas de votacion de un partido
  async getMatchVotingStats(matchId: string): Promise<VoteStatistics[]> {
    return await Vote.aggregate([
      { $match: { matchId: new mongoose.Types.ObjectId(matchId) }},
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
      { $match: { matchId: new mongoose.Types.ObjectId(matchId) }},
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
        playerName: '$player.nombre',
        playerApodo: '$player.apodo',
        playerImagen: '$player.imagen',
        totalVotos: 1,
        ultimoVoto: 1
      }},
      { $sort: { totalVotos: -1 } }
    ]);
  }

  //obtener el total de votos de un partido
  async getTotalVotes(matchId: string): Promise<number> {
    return await Vote.countDocuments({ matchId: new mongoose.Types.ObjectId(matchId) });
  }

  //eliminar votos de un partido
  async deleteVotesByMatch(matchId: string): Promise<number> {
    const result = await Vote.deleteMany({ matchId: new mongoose.Types.ObjectId(matchId) });
    return result.deletedCount || 0;
  }

  // obtener los votos en vivo
  async getLiveVotingStats(matchId: string): Promise<UserVoteResponse[]> {
    return await Vote.aggregate([
      { $match: { matchId: new mongoose.Types.ObjectId(matchId) }},
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
        playerName: '$player.nombre',
        playerApodo: '$player.apodo',
        playerImagen: '$player.imagen',
        totalVotos: 1,
        porcentaje: { $multiply: [{ $divide: ['$totalVotos', { $sum: '$totalVotos' }] }, 100] }
      }},
      { $sort: { totalVotos: -1 } }
    ]);
  }

  // obtener el ganador de un partido
  async getMatchWinner(matchId: string): Promise<WinnerResponse | null> {
    const result = await Vote.aggregate([
      { $match: { matchId: new mongoose.Types.ObjectId(matchId) }},
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
        playerName: '$player.nombre',
        playerApodo: '$player.apodo',
        playerImagen: '$player.imagen',
        totalVotos: 1
      }},
      { $sort: { totalVotos: -1 } },
      { $limit: 1 }
    ]);
    
    return result[0] || null;
  }

    // Método para obtener top 3 jugadores más votados
  async getTop3Players(matchId: string): Promise<any[]> {
    if (!mongoose.Types.ObjectId.isValid(matchId)) {
      throw new Error('ID de partido inválido');
    }
    
    return await Vote.aggregate([
      { $match: { matchId: new mongoose.Types.ObjectId(matchId) }},
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
        playerName: '$player.nombre',
        playerApodo: '$player.apodo',
        playerImagen: '$player.imagen',
        totalVotos: 1
      }},
      { $sort: { totalVotos: -1 } },
      { $limit: 3 }
    ]);
  }

  // Método para obtener el voto de un usuario específico
  async getUserVote(userId: string, matchId: string): Promise<UserVoteResponse | null> {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(matchId)) {
      throw new Error('ID inválido');
    }
    
    const result = await Vote.aggregate([
      { $match: { 
        userId: new mongoose.Types.ObjectId(userId), 
        matchId: new mongoose.Types.ObjectId(matchId) 
      }},
      { $lookup: {
        from: 'players',
        localField: 'playerId',
        foreignField: '_id',
        as: 'player'
      }},
      { $unwind: '$player' },
      { $project: {
        playerId: '$playerId',
        playerName: '$player.nombre',
        playerApodo: '$player.apodo',
        playerImagen: '$player.imagen',
        fechaVoto: '$fechaVoto'
      }}
    ]);
    
    return result[0] || null;
  }
}
