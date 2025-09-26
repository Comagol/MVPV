import mongoose, { Document, Schema, Types } from "mongoose";

//Creo la interfaz para TypesCript
export interface IVote extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  playerId: Types.ObjectId;
  matchId: Types.ObjectId;
  fechaVoto: Date;
  token?: string;
}

//Schema de moongose
const voteSchema = new Schema<IVote>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  playerId: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
  },
  matchId: {
    type: Schema.Types.ObjectId,
    ref: 'Match',
    required: true
  },
  fechaVoto: {
    type: Date,
    default: Date.now
  },
  token: {
    type: String,
    required: false
  }
}, {
  timestamps: true
})

//Indices para mejorar la performance
voteSchema.index({ userId: 1, matchId: 1}, { unique: true });

//Metodos del modelo
//Metodo para ver si el voto es valido
voteSchema.methods.esVotoValido = function() {
  const ahora = new Date();
  const horasDesdeVoto = (ahora.getTime() - this.fechaVoto.getTime()) / (1000 * 60 * 60);
  return horasDesdeVoto <= 24;
};

//Metodos estaticos
  voteSchema.statics.obtenerVotosPorPartido = function(matchId: Types.ObjectId) {
  return this.find({ matchId })
  .populate('userId', 'nombre email')
  .populate('playerId', 'nombre apodo')
  .sort({ fechaVoto: -1 })
};

//Metodo para verificar si el usuario ya ha votado
voteSchema.statics.verficarVoto = function(userId: Types.ObjectId, matchId: Types.ObjectId) {
  return this.findOne({ userId, matchId});
};

//Contar votos por jugador en un partido
voteSchema.statics.contarVotosPorJugador = function(playerId: Types.ObjectId, matchId: Types.ObjectId) {
  return this.countDocuments({ playerId, matchId });
};

//metodo para obtener las estadisticas del partido
voteSchema.statics.obtenerEstadisticasPartido = function(matchId: Types.ObjectId) { 
  return this.aggregate([
    { $match: { matchId } },
    { $group: {
      _id: '$playerId',
      totalVotos: { $sum: 1 },
    }},
    { $sort: { totalVotos: -1 }}
  ]);
};

export const Vote = mongoose.model<IVote>('Vote', voteSchema);