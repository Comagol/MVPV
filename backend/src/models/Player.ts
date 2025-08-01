import mongoose, { Document, Schema } from 'mongoose';

// Creo la interfase para Typescript
export interface IPlayer extends Document {
  nombre: string;
  apodo: string;
  posicion: string;
  votos: number;
  imagen: string;
  activo: boolean;
  camada: number;
  fechaRegistro: Date;
}