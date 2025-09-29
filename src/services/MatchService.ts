import { MatchDao } from '../dao/MatchDao';
import { CreateMatchRequest, MatchResponse, UpdateMatchRequest } from '../types/match.types';
import { IMatch } from '../models/Match';

export class MatchService {
  private matchDao: MatchDao;

  constructor() {
    this.matchDao = new MatchDao();
  }

  // Creo un metodo privado para formatear la respuesta a como la espera el frontend
  private formatMatchResponse(match: IMatch): MatchResponse {
    return {
      id: match._id.toString(),
      fecha: match.fecha,
      estado: match.estado,
      description: match.descripcion || '',
      rival: match.rival,
      jugadores: match.jugadores.map((player) => ({
        id: player._id.toString(),
        nombre: player.nombre,
        apodo: player.apodo,
        posicion: player.posicion,
        imagen: player.imagen,
        camiseta: player.camiseta,
        camada: player.camada,
        activo: player.activo,
      })),
      ganador: match.ganador ? {
        id: match.ganador._id.toString(),
        nombre: match.ganador.nombre,
        apodo: match.ganador.apodo,
        posicion: match.ganador.posicion,
        imagen: match.ganador.imagen, 
        camiseta: match.ganador.camiseta,
        camada: match.ganador.camada,
        activo: match.ganador.activo,
      } : undefined
    }
  }

  // Crear un nuevo partido
  async createMatch(matchData: CreateMatchRequest): Promise<MatchResponse> {
    //valido que no haya mas de 23 jugadores;
    if(matchData.jugadores.length > 23){
      throw new Error('No se puede crear un partido con mas de 23 jugadores');
    }
    if(matchData.jugadores.length < 15) {
      throw new Error('No se puede crear un partido con menos de 15 jugadores');
    }
    // creo el partido en la base de datos
    const match = await this.matchDao.createMatch(matchData);
    // retorno la respuesta formateada
    return this.formatMatchResponse(match);
  }

  // obtener todos los partidos
  async getAllMatches(): Promise<MatchResponse[]> {
    // obtengo todos los partidos de la DB
    const matches = await this.matchDao.findAll();
    // retorno la respuesta formateada
    return matches.map(match => this.formatMatchResponse(match));
  };

  // obtener un partido por id
  async getMatchById(id: string): Promise<MatchResponse | null> {
    // obtengo el partido por id de la DB
    const match = await this.matchDao.findById(id);
    //validacion
    if(!match) {
      return null;
    }
    // retorno la respuesta formateada
    return this.formatMatchResponse(match);
  };

  // obtener partidos activos
  async getActiveMatches(): Promise<MatchResponse[]> {
    // obtengo los partidos activos de la DB
    const matches = await this.matchDao.findActiveMatches();
    // retorno la respuesta formateada
    return matches.map(match => this.formatMatchResponse(match));
  };

  // obtener los partidos finalizados
  async getFinishedMatches(): Promise<MatchResponse[]> {
    // obtengo los partidos finalizados de la DB
    const matches = await this.matchDao.findFinishedMatches();
    // retorno la respuesta formateada
    return matches.map(match => this.formatMatchResponse(match));
  };

  // obtener partidos programados
  async getScheduledMatches(): Promise<MatchResponse[]> {
    // obtengo los partidos programados en la base de datos
    const matches = await this.matchDao.getScheduleMatches();
    // retorno la respuesta formateada
    return matches.map(match => this.formatMatchResponse(match));
  };

  //actualizar un partido
  async updateMatch(id: string, updateData: UpdateMatchRequest): Promise<MatchResponse | null> {
    //obtengo el partido por id de la DB para poder actualizarlo
    const currentMatch = await this.matchDao.findById(id);
    // valido que el partido exista, salgo con error
    if(!currentMatch) {
      throw new Error('Partido no encontrado');
    }

    //valido que el partido no este en un estado distinto a 'programado'
    if(currentMatch.estado !== 'programado') {
      throw new Error('No se puede actualizar un partido cuyo estado no sea programado');
    }
    // valido que la cantidad de jugadores no sea mayor a 23
    if(updateData.jugadores && updateData.jugadores.length > 23) {
      throw new Error('No se puede actualizar un partido con mas de 23 jugadores');
    }
    // valido que la cantidad de jugadores no sea menor a 15
    if(updateData.jugadores && updateData.jugadores.length < 15) {
      throw new Error('No se puede actualizar un partido con menos de 15 jugadores');
    }
    // actualizo el partido en la base de datos
    const updatedMatch = await this.matchDao.updateMatch(id, updateData);
    if(!updatedMatch) {
      return null;
    }
    // retorno la respuesta formateada
    return this.formatMatchResponse(updatedMatch);
  };

  // Iniciar un partido
  async startMatch(id: string): Promise<MatchResponse | null> {
    // obtengo y valido que el partido exita
    const currentMatch = await this.matchDao.findById(id);
    if(!currentMatch) {
      throw new Error('Partido no encontrado');
    }
    // // valido que el estado del currentmatch sea programado
    if(currentMatch.estado !== 'programado') {
      throw new Error('no se puede iniciar un partido que no este programado');
    }
    // cambio el estado del partido a en_proceso
    const match = await this.matchDao.startMatch(id);
    if(!match) {
      return null;
    }
    // retorno la respuesta formateada
    return this.formatMatchResponse(match);
  };

  // finalizar un partido
  async finishMatch(id: string): Promise<MatchResponse | null> {
    // obtengo y valido que el partido exista
    const currentMatch = await this.matchDao.findById(id);
    if(!currentMatch) {
      throw new Error('Partido no encontrado');
    }
    if(currentMatch.estado !== 'en_proceso') {
      throw new Error('no se puede finalizar un partido que no este en proceso');
    }
    // cambio el estado del partido a finalizado
    const match = await this.matchDao.finishMatch(id);
    if(!match) {
      return null;
    }
    // retorno la respuesta formateada
    return this.formatMatchResponse(match);
  };

  // obtener el ultimo partido
  async getLastMatch(): Promise<MatchResponse | null> {
    const match = await this.matchDao.getLastMatch();
    if(!match) {
      return null;
    }
    // retorno la respuesta formateada
    return this.formatMatchResponse(match);
  }
}