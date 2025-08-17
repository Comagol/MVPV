// IMporto los tipos de jugador
import { PlayerResponse } from './player.types';

//creo y exporto los tipos para crear un partido
export interface CreateMatchRequest {
  fecha: Date;
  jugadores: string[];
  description: string;
}

//creo y exporto los tipos para actualizar un partido
export interface UpdateMatchRequest {
  fecha?: Date;
  jugadores?: string[];
  description?: string;
  estado?: 'programado' | 'en_proceso' | 'finalizado';
}

//creo y exporto los tipos para respuesta de un partido
export interface MatchResponse {
  id: string;
  fecha: Date;
  estado: 'programado' | 'en_proceso' | 'finalizado';
  jugadores: PlayerResponse[];
  ganador?: PlayerResponse;
  description: string;
}

//Creo y exporto los tipos para las estadisticas de un partido
export interface MatchStatistics {
  id: string;
  fecha: Date;
  totalVotos: number;
  ganador?: {
    id: string;
    nombre: string;
    apodo: string;
    votosRecibidos: number;
  };
}

// tipos para resultados de votacion
export interface MatchVotingResult {
  matchId: string;
  fecha: Date;
  jugadores: {
    id: string;
    nombre: string;
    apodo: string;
    votosRecibidos: number;
    porcentajeVotos: number;
  }[];
  totalVotos: number;
  ganador?: {
    id: string;
    nombre: string;
    apodo: string;
    votosRecibidos: number;
  };
}