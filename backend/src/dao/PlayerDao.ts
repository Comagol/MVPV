import { Player, IPlayer } from "../models/Player";
import { CreatePlayerRequest, UpdatePlayerRequest } from "../types/player.types";

export class PlayerDao {

  //Crear un nuevo jugador
  async createPlayer(playerData: CreatePlayerRequest): Promise<IPlayer> {
    const player = new Player(playerData);
    return await player.save();
  }

  //obtengo jugaodr por ID
  async findById(id: string): Promise<IPlayer | null> {
    return await Player.findById(id);
  }

  //obtengo todos los jugadores
  async findAll(): Promise<IPlayer[]> {
    return await Player.find().sort({ nombre: 1 });
  }

  //obtener jugadores activos
  async findActivePlayers(): Promise<IPlayer[]> {
    return await Player.find({ activo: true }).sort({ nombre: 1 });
  }

  //obtener jugadores por camada
  async findByCamada(camada: number): Promise<IPlayer[]> {
    return await Player.find({ camada, activo: true }).sort({ nombre: 1 });
  }

  //actualizar un jugador
  async updatePlayer(id: string, updateData: UpdatePlayerRequest): Promise<IPlayer | null> {
    return await Player.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
  }

  //eliminar un jugador (soft delete)
  async deletePlayer(id: string): Promise<IPlayer | null> {
    return await Player.findByIdAndUpdate(
    id,
    { activo: false }, 
    { new: true, runValidators: true }
    );
  }

  //Obtener top 10 jugadores
  async getTopTenPlayers(): Promise<IPlayer[]> {
    return await Player.find({ activo: true })
    .sort({ votos: -1 })
    .limit(10);
  }

  //Buscar jugadores por nombre o apodo
  async search(searchTerm: string): Promise<IPlayer[]> {
    return await Player.find({
      activo: true,
      $or: [
        { nombre: { $regex: searchTerm, $options: 'i '}},
        { apodo: { $regex: searchTerm, $options: 'i '}}        
      ]
    }).sort({ nombre: 1 });
  }

  //Incrementar votos de un jugador
  async incrementVotes(id: string): Promise<IPlayer | null> {
    return await Player.findByIdAndUpdate(
      id,
      { $inc: { votos: 1 }},
      { new: true }
    );
  }

  //Obtener estadisticas de jugadores
  async getStatistics(): Promise<any> {
    return await Player.aggregate([
      { $match: { activo: true }},
      { $group: {
        _id: null,
        totalJugadores: { $sum: 1 },
        totalVotos: { $sum: '$votos' },
        promedioVotos: { $avg: '$votos' }
      }}
    ]);
  }

}