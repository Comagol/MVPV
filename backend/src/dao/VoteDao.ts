import { Vote, IVote } from "../models/Vote";
import { VoteRequest, VoteResponse, VoteStatistics } from "../types/vote.types";

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
  async hasVoted(playerId: string, matchId: string): Promise<IVote | null> {
    return await Vote.findOne({ playerId, matchId});
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

  // Obtener votos por jugador de un partido especifico
  async findByPlayerInMatch(matchId: string, playerId: string): Promise<IVote[]> {
    return await Vote.find({ matchId, playerId })
    .populate('userId', ' nombre email')
    .sort({ fechaVoto: -1 })
  }

  //contar votos por jugador en un partido
  async countVotesByPlayerInMatch(matchId: string, playerId: string): Promise<number> {
    return await Vote.countDocuments({ matchId, playerId });
  }

  

}
