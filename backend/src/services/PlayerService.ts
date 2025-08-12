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

  // obtener un jugador por su id
  async getPlayerById(id: string): Promise<PlayerResponse | null> {
  const player = await this.playerDao.findById(id);
  return player ? this.formatPlayerResponse(player) : null;
  }

  // Obtener todos los jugadores activos
  async getActivePlayers(): Promise<PlayerResponse[]> {
    const players = await this.playerDao.findActivePlayers();
    return players.map(player => this.formatPlayerResponse(player));
  }

  //obtener jugadores por camada
  async getPlayersByCamada(camada: number): Promise<PlayerResponse[]> {
    const players = await this.playerDao.findByCamada(camada);
    return players.map(player => this.formatPlayerResponse(player));
  }

  //actualizar un jugador
  async updatePlayer(id: string, updateData: UpdatePlayerRequest): Promise<PlayerResponse | null> {
    const currentPlayer = await this.playerDao.findById(id);
    if (!currentPlayer) {
      throw new Error(`No se encontro al jugador`);
    }
    const updatedPlayer = await this.playerDao.updatePlayer(id, updateData);
    return updatedPlayer ? this.formatPlayerResponse(updatedPlayer) : null;
  }

  //eliminar un jugador
  async deletePlayer(id: string): Promise<boolean> {
    const deletedPlayer = await this.playerDao.deletePlayer(id);
    return !!deletedPlayer;
  }

  //obtener top 3 jugadores
  async getTopThreePlayers(): Promise<PlayerResponse[]> {
    const players = await this.playerDao.getTopThreePlayers();
    return players.slice(0, 3).map(player => this.formatPlayerResponse(player));
  }
}