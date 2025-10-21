// tipos para crear un voto
export interface VoteRequest {
  userId: string;
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
  playerApodo: string;
  playerImagen: string;
  totalVotos: number;
  porcentaje: number;
}

// tipos para respuesta de validacion de votos
export interface VoteValidationResponse {
  puedeVotar: boolean;
  razon?: string;
  tiempoRestante?: number;
}

// tipos para respuesta de ganador de partido
export interface WinnerResponse {
  playerId: string;
  playerName: string;
  playerApodo: string;
  playerImagen: string;
  totalVotos: number;
}


export interface UserVoteResponse {
  playerId: string;
  playerName: string;
  playerApodo: string;
  playerImagen: string;
  fechaVoto: Date;
}

export interface UserVoteHistoryResponse {
  voteId: string;
  playerId: string;
  playerName: string;
  playerApodo: string;
  playerImagen: string;
  playerPosicion: string;
  playerCamiseta: number;
  matchId: string;
  matchFecha: Date;
  matchRival: string;
  matchEstado: string;
  matchDescripcion: string;
  fechaVoto: Date;
}