import mongoose, { Document, Schema } from 'mongoose';
import { IPlayer } from './Player';
import { Vote } from './Vote';

//Creo la interfaz para TypesCript
export interface IMatch extends Document {
  fecha: Date;
  estado: 'programado' | 'en_proceso' | 'finalizado';
  jugadores: IPlayer[];
  ganador?: IPlayer;
  descripcion?: string;
  totalVotos: number;
  fechaVotacion: Date; 
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
  },
  fechaVotacion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

//Indices para mejorar la performance
matchSchema.index({ fecha: 1});

//Metodos del modelo
matchSchema.methods.incrementarVotos = function() {
  this.totalVotos += 1;
  return this.save();
};

//Metodo para iniciar un partido
matchSchema.methods.iniciarPartido = function() {
  this.estado = 'en_proceso';
  return this.save();
};

//Metodo para finalizar un partido
matchSchema.methods.finalizarPartido = function() {
  this.estado = 'finalizado';
  return this.save();
};

//MEtodo para verificar si el partido esta en curso para votar
matchSchema.methods.votacionAbierta = function() {
  return this.estado === 'en_proceso' && this.fechaVotacion > new Date();
};

matchSchema.methods.calcularGanador = async function() {
  const jugadorGanador = await Vote.aggregate([
    { $match: { matchId: this._id } },
    { $group: { _id: '$playerId', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 }
  ]);

  if (jugadorGanador.length === 0) {
    throw new Error('No hay votos registrados para este partido');
  } else {
    this.ganador = jugadorGanador[0]._id;
    this.estado = 'finalizado';
    return this.save();
  }
};

//Metodo para obtener partidos activos
matchSchema.statics.obtenerPartidosActivos = function() {
  return this.find({
    estado: 'en_proceso',
    fechaVotacion: { $gt: new Date() }
  })
  .populate('jugadores')
  .sort({ fecha: 1 })
  .lean();
};


export const Match = mongoose.model<IMatch>('Match', matchSchema);