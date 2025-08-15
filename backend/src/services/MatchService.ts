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
      totalVotos: match.totalVotos,
      fechaCreacion: match.fecha,
      jugadores: match.jugadores.map((player) => ({
        id: player._id.toString(),
        nombre: player.nombre,
        apodo: player.apodo,
        posicion: player.posicion,
        imagen: player.imagen,
        camiseta: player.camiseta,
        camada: player.camada,
        activo: player.activo,
        votos: player.votos,
        fechaRegistro: player.fechaRegistro
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
        votos: match.ganador.votos,
        fechaRegistro: match.ganador.fechaRegistro
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

  
}