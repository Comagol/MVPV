import mongoose, { Document, Schema } from 'mongoose';
import { IPlayer } from './Player';

//Creo la interfaz para TypesCript
export interface IMatch extends Document {
  fecha: Date;
  estado: 'programado' | 'en_proceso' | 'finalizado';
  jugadores: IPlayer[];
  ganador?: IPlayer;
  descripcion?: string;
  totalVotos: number;
}

//Creo el Schema del partido
const matchSchema = new Schema<IMatch>({
  fecha: {
    type: Date,
    required: true,
    },
  estado: {
    type: String,
    required: true,
    enum: ['programado', 'en_proceso', 'finalizado'],
    default: 'programado'
  },
  jugadores: [{
    type: Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  }],
  ganador: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
    required: false
  },
  descripcion: {
    type: String,
    maxlength: 500,
    trim: true
  },
  totalVotos: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

//Indices para mejorar la performance
matchSchema.index({ fecha: 1});
matchSchema.index({ estado: 1});


export const Match = mongoose.model<IMatch>('Match', matchSchema);