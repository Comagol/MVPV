export interface VoteRequest {
  playerId: string;
  matchId: string;
  token: string;
}

export interface VoteResponse {
  id: string;
  playerId: string;
  matchId: string;
  fechaVoto: Date;
}

export interface VoteStatistics {
  playerId: string;
  playerName: string;
  totalVotos: number;
  porcentaje: number;
}

export interface VoteValidationResponse {
  puedeVotar: boolean;
  razon?: string;
  tiempoRestante?: number;
}