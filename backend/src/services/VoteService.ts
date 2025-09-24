import { VoteDao } from "../dao/VoteDao";
import { VoteResponse, VoteRequest, VoteStatistics, VoteValidationResponse, WinnerResponse, UserVoteResponse } from "../types/vote.types";
import { IVote } from "../models/Vote";
import { MatchDao } from "../dao/MatchDao";
import { PlayerDao } from "../dao/PlayerDao";
import { UserDao } from "../dao/UserDao";
import { EmailService } from "./EmailService";

export class VoteService {
 private voteDao: VoteDao;
 private matchDao: MatchDao;
 private playerDao: PlayerDao;
 private userDao: UserDao;

 constructor() {
  this.voteDao = new VoteDao();
  this.matchDao = new MatchDao();
  this.playerDao = new PlayerDao();
  this.userDao = new UserDao();
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

  // 🆕 NUEVO: Enviar email de agradecimiento después del voto exitoso
  try {
    // Obtener información del usuario
    const user = await this.userDao.getUserById(userId);
    
    if (user && user.email) {
      // Construir información del partido
      const matchInfo = `Vicentinos vs ${match.rival}`;
      
      // Enviar email de agradecimiento
      const emailService = new EmailService();
      await emailService.sendVoteThankYou({
        email: user.email,
        userName: user.nombre,
        playerName: player.nombre,
        playerImagen: player.imagen || '', // Usar apodo como imagen temporal
        matchInfo: matchInfo
      });

      console.log(`✅ Email de agradecimiento enviado a: ${user.email}`);
    }
  } catch (emailError) {
    // Si el email falla, solo logueamos el error pero NO fallamos el voto
    console.error('❌ Error enviando email de agradecimiento:', emailError);
    // El voto ya fue creado exitosamente, así que continúamos
  }

  return this.formatVoteResponse(vote);
}

  // metodo para verificar si el usuario puede votar
  async validateVote(userId: string, matchId: string): Promise<VoteValidationResponse> {
    //valido que el partido exista
    const match = await this.matchDao.findById(matchId);
    if(!match) {
      return {
        puedeVotar: false,
        razon: 'partido no encontrado'
      }
    }
    if( match.estado !== 'en_proceso') {
      return {
        puedeVotar: false,
        razon: 'El partido no esta en proceso'
      }
    }

    // verificar si el usuario ya ha votado
    const existingVote = await this.voteDao.hasVoted(userId, matchId);
    if(existingVote) {
      return {
        puedeVotar: false,
        razon: 'Ya has votado para este partido'
      }
    }
    return {
      puedeVotar: true
    };
  }

  // metodo para obtener las estadisticas de votos de un partido
  async getMatchVoteStatistics(matchId: string): Promise<VoteStatistics[]> {
    const stats = await this.voteDao.getDetailedMatchStats(matchId);
    const totalVotos = await this.voteDao.getTotalVotes(matchId);

    return stats.map(stat => ({
      playerId: stat.playerId.toString(),
      playerName: stat.playerName,
      playerApodo: stat.playerApodo,
      playerImagen: stat.playerImagen,
      totalVotos: stat.totalVotos,
      porcentaje: totalVotos > 0 ? (stat.totalVotos / totalVotos) * 100 : 0
    }));
  }

  // metodo para obtener al ganador de un partido
  async getMatchWinner(matchId: string): Promise<WinnerResponse | null> {
    const winner = await this.voteDao.getMatchWinner(matchId);
    if(!winner)
      return null;
    return {
      playerId: winner.playerId.toString(),
      playerName: winner.playerName,
      playerApodo: winner.playerApodo,
      playerImagen: winner.playerImagen,
      totalVotos: winner.totalVotos
    }
  }

  //obtengo la camtidad total de votos de un partido
  async getTotalVotes(matchId: string): Promise<number> {
    return await this.voteDao.getTotalVotes(matchId);
  }

  // Obtener top 3 jugadores más votados
  async getTop3Players(matchId: string): Promise<VoteStatistics[]> {
    const top3 = await this.voteDao.getTop3Players(matchId);
    const totalVotos = await this.voteDao.getTotalVotes(matchId);
    
    return top3.map(player => ({
      playerId: player.playerId.toString(),
      playerName: player.playerName,
      playerApodo: player.playerApodo,
      playerImagen: player.playerImagen,
      totalVotos: player.totalVotos,
      porcentaje: totalVotos > 0 ? (player.totalVotos / totalVotos) * 100 : 0
    }));
  }

  // Obtener voto del usuario autenticado
  async getUserVote(userId: string, matchId: string): Promise<UserVoteResponse | null> {
    const userVote = await this.voteDao.getUserVote(userId, matchId);
    if (!userVote) {
      return null;
    }
    
    return {
      playerId: userVote.playerId.toString(),
      playerName: userVote.playerName,
      playerApodo: userVote.playerApodo,
      playerImagen: userVote.playerImagen,
      fechaVoto: userVote.fechaVoto
    };
  }
}