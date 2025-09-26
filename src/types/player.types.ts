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

// Tipos para respuesta de un jugador
export interface PlayerResponse {
  id: string;
  nombre: string;
  apodo: string;
  posicion: string;
  imagen: string;
  camiseta: number;
  camada: number;
  activo: boolean;
}

// Tipos para respuesta de la lista de jugadores
export interface PlayerListResponse {
  jugadores: PlayerResponse[];
  total: number;
  camada?: number;
}

// Tipos para respuesta de las estadisticas de un jugador
export interface PlayerStatistics {
  id: string;
  nombre: string;
  apodo: string;
}

// Tipos para paginacion de la lista de jugadores
export interface PlayerPagination {
  page: number;
  limit: number;
  sort?: 'nombre' | 'apodo' | 'camada';
  order?: 'asc' | 'desc';
}