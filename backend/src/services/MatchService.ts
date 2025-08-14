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

  
}