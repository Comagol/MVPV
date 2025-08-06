import { match } from "assert";
import { Match, IMatch } from "../models/Match";
import { CreateMatchRequest, UpdateMatchRequest, MatchResponse } from "../types/match.types" ;

export class MatchDao {

  //crear un nuevo partido
  async createMatch(matchData: CreateMatchRequest): Promise<IMatch> {
    const match = new Match(matchData);
    return await match.save();
  }

  //obtener partido por ID
  async findById(id: string): Promise<IMatch | null> {
    return await Match.findById(id).populate('jugadores ganador');
  }

  //obtener todos los partidos
  async findAll(): Promise<IMatch[]> {
    return await Match.find().populate(' jugadores ganador');
  }

  //obtener partidos activos(en proceso o programados)
  async findActiveMatches(): Promise<IMatch[]> {
    return await Match.find({
      estado: 'en_proceso',
      fechaVotacion: { $gte: new Date() }
    })
    .populate('jugadores')
    .sort({ fecha: 1 });
  }

  //obtener partidos finalizados
  async findFinishedMatches(): Promise<IMatch[]> {
    return await Match.find({
      estado: 'finalizado'
    })
    .populate( 'jugadores ganador' )
    .sort({ fecha: -1 });
  }

  //actualizar un partido
  async updateMatch(id: string, matchData: UpdateMatchRequest): Promise<IMatch | null> {
    return await Match.findByIdAndUpdate(
      id, 
      matchData, 
      { new: true, runValidators: true })
      .populate('jugadores ganador');
  }

  // Iniciar un partido
  async startMatch(id: string): Promise<IMatch | null> {
    return await Match.findByIdAndUpdate(
      id,
      { estado: 'en_proceso' },
      { new: true } 
    ).populate('jugadores');
  }

  //finalizar un partido
  async finishMatch(id: string): Promise<IMatch | null> {
    return await Match.findByIdAndUpdate(
      id,
      {estado: 'finalizado'},
      { new: true}
    ).populate('jugadores ganador');
  }

  //incrementar votos del partido
  async incrementVotes(id: string): Promise<IMatch | null> {
    return await Match.findByIdAndUpdate(
      id,
      { $inc: { votos: 1 }},
      { new: true }
    )
  }

  //Verificar si la votacion esta abierta
  async isVotingOpen(id: string): Promise<boolean> {
    const match = await Match.findById(id);
    if(!match) return false;
    
    return match.estado === 'en_proceso' &&
    match.fechaVotacion >= new Date();
  }

  //Obtener partido que esta activo para votar
  async getActiveMatchForVoting(): Promise<IMatch | null> {
    return await Match.findOne({
      estado: 'en_proceso',
      fechaVotacion: { $lte: new Date() }
    })
    .populate('jugadores')
    .sort({ fechaVotacion: 1 });
  }

  //Obtener partidos programados
  async getScheduleMatches(): Promise<IMatch[]> {
    return await Match.find({
      estado: 'programado'
    })
    .populate('jugadores')
    .sort({ fecha: 1 });
  }
}