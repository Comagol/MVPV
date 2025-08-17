import { VoteDao } from "../dao/VoteDao";
import { VoteResponse, VoteRequest, VoteStatistics, VoteValidationResponse } from "../types/vote.types";
import { IVote } from "../models/Vote";
import { MatchDao } from "../dao/MatchDao";
import { PlayerDao } from "../dao/PlayerDao";

export class VoteService {
 private voteDao: VoteDao;
 private matchDao: MatchDao;
 private playerDao: PlayerDao;

 constructor() {
  this.voteDao = new VoteDao();
  this.matchDao = new MatchDao();
  this.playerDao = new PlayerDao();
 }

 // formatear la respuesta para el frontend
 private formatVoteResponse(vote: IVote): VoteResponse {
  return {
    id: vote._id.toString(),
    playerId: vote.playerId.toString(),
    matchId: vote.matchId.toString(),
    fechaVoto: vote.fechaVoto
  }
 }

 // metodo para crear un voto
 async createVote(voteData: VoteRequest, userId: string): Promise<VoteResponse> {
  //valido que el partido exista
  const match = await this.matchDao.findById(voteData.matchId);
  if(!match) {
    throw new Error('Partido no encontrado');
  }
  //Valido que el partido este en proceso
  if(match.estado !== 'en_proceso') {
    throw new Error('No se puede votar en un partido que no este en proceso');
  }
  //valido si el jugador existe y este activo
  const player = await this.playerDao.findById(voteData.playerId);
  if(!player) {
    throw new Error('Jugador no encontrado');
  }
  if(!player.activo) {
    throw new Error('El jugador no esta activo');
  }

  // verifico que el jugador este en el partido.
  const playerInMatch = match.jugadores.some(p => p._id.toString() === voteData.playerId);
  if(!playerInMatch) {
    throw new Error('El jugador no esta en el partido');
  }

  // verifico que el usuario no haya votado ya
  const existingVote = await this.voteDao.hasVoted(userId, voteData.matchId);
  if(existingVote) {
    throw new Error('Ya has votado para este partido');
  }

  //creo el voto del usuario
  const vote = await this.voteDao.createVote({
    userId,
    playerId: voteData.playerId,
    matchId: voteData.matchId,
    token: voteData.token
  });

  return this.formatVoteResponse(vote);
  }
}