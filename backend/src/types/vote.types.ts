// tipos para crear un voto
export interface VoteRequest {
  playerId: string;
  matchId: string;
  token: string;
}

// tipos para respuesta de un voto
export interface VoteResponse {
  id: string;
  playerId: string;
  matchId: string;
  fechaVoto: Date;
}

// tipos para estadisticas de votos
export interface VoteStatistics {
  playerId: string;
  playerName: string;
  totalVotos: number;
  porcentaje: number;
}

// tipos para respuesta de validacion de votos
export interface VoteValidationResponse {
  puedeVotar: boolean;
  razon?: string;
  tiempoRestante?: number;
}