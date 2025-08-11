import mongoose, { Document, Schema, Types } from 'mongoose';

// Creo la interfase para Typescript
export interface IPlayer extends Document {
  _id: Types.ObjectId;
  nombre: string;
  apodo: string;
  posicion: string;
  votos: number;
  imagen: string;
  camiseta: number;
  activo: boolean;
  camada: number;
  fechaRegistro: Date;
}

//Creo el Schema del jugador
const playerSchema = new Schema<IPlayer>({
  nombre: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  apodo: {
    type: String,
    required: true,
    trim: true,
    maxLength:50
  },
  posicion: {
    type: String,
    required: true,
    enum: ['Pilar izquierdo',
      'Hoocker',
      'Pilar derecho',
      'Segunda linea izquierdo',
      'Segunda linea derecho',
      'Ala izquierdo',
      'Ala derecho',
      'Octavo',
      'Medio Scrum',
      'Apertura',
      'Wing izquierdo',
      'Wing derecho',
      'Primer centro',
      'Segundo centro',
      'Fullback'
    ]
  },
  imagen: {
    type: String,
    required: true,
    trim: true,
  },
  camiseta: {
    type: Number,
    required: true,
    min: 1,
    max: 23
  },
  activo: {
    type: Boolean,
    default: true
  },
  camada: {
    type: Number,
    required: true,
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  },
  votos: {
    type: Number,
    default: 0,
    min: 0
  }

}, {
  timestamps: true
});

//Indices para mejorar la performance
playerSchema.index({ nombre: 1, camada: 1});
playerSchema.index({ camada: 1});

//Metodos del modelo
playerSchema.methods.incrementarVotos = function() {
  this.votos += 1;
  return this.save();
};

//Metodo para verificar si el jugador esta activo
playerSchema.methods.estaActivo = function() {
  return this.activo;
};

//Metodo para obtener top 3 jugadores
playerSchema.statics.obtenerTop3 = async function(limit: number = 3) {
  const topJugadores = await this.find({ activo: true })
  .sort({ votos: -1 })
  .limit(limit)
  .select('nombre apodo votos')
  .lean();

  return topJugadores;
};

//exporto el modelo
export const Player = mongoose.model<IPlayer>('Player', playerSchema);