import { PlayerDao } from "../dao/PlayerDao";
import { CreatePlayerRequest, UpdatePlayerRequest, PlayerResponse } from "../types/player.types";
import { IPlayer } from "../models/Player";

export class PlayerService {

  private playerDao: PlayerDao;

  private formatPlayerResponse(player: IPlayer): PlayerResponse {
    return {
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
    };
  }

  constructor() {
    this.playerDao = new PlayerDao();
  }

  //Crear un nuevo jugador
  async createPlayer(playerData: CreatePlayerRequest): Promise<PlayerResponse> {
    //validacion para que no exista un jugador con el mismo nombre y camada
    const existingPlayer = await this.playerDao.findByNombreAndCamada(
      playerData.nombre,
      playerData.camada
    );

    if (existingPlayer) {
      throw new Error(`Ya existe un jugador con el nombre '${playerData.nombre}' en la camada ${playerData.camada}`);
    }
    //crear al jugador
    const player = await this.playerDao.createPlayer(playerData);

    //retornar la respuesta formateada
    return this.formatPlayerResponse(player);
  }
}