// Creo los tipos para mejorar la solidez del codigo y las validaciones en el backend y el frontend

// Tipos para crear un jugador
export interface CreatePlayerRequest {
  nombre: string;
  apodo: string;
  posicion: string;
  imagen: string;
  camiseta: number;
  camada: number;
}

// Tipos para actualizar un jugador
export interface UpdatePlayerRequest {
  nombre?: string;
  apodo?: string;
  posicion?: string;
  imagen?: string;
  camiseta?: number;
  camada?: number;
  activo?: boolean;
}

// Tipos para obtener un jugador
export interface PlayerResponse {
  id: string;
  nombre: string;
  apodo: string;
  posicion: string;
  imagen: string;
  camiseta: number;
  camada: number;
  activo: boolean;
  votos: number;
  fechaRegistro: Date;
}

// Tipos para obtener la lista de jugadores
export interface PlayerListResponse {
  jugadores: PlayerResponse[];
  total: number;
  camada?: number;
}

// Tipos para obtener las estadisticas de un jugador
export interface PlayerStatistics {
  id: string;
  nombre: string;
  apodo: string;
  totalVotos: number;
}

// Tipos para la paginacion de la lista de jugadores
export interface PlayerPagination {
  page: number;
  limit: number;
  sort?: 'nombre' | 'votos' | 'apodo' | 'camada';
  order?: 'asc' | 'desc';
}