import mongoose, { Document, Schema } from 'mongoose';

//Creo la interfaz para TypeScript
export interface IUser extends Document {
  email: string;
  nombre: string;
  fechaRegistro: Date;
  ultimoVoto?: Date;
  votosRealizados: number;
  activo: boolean;
  token?: string;
  tokenExpires?: Date;
}

//Schema de MongoDB
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  nombre: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  },
  ultimoVoto: {
    type: Date,
    default: null
  },
  votosRealizados: {
    type: Number,
    default: 0,
    min: 0
  },
  activo: {
    type: Boolean,
    default: true
  },
  token: {
    type: String,
    required: false
  },
  tokenExpires: {
    type: Date,
    required: false
  }
}, {
  timestamps: true //Agrega createdAt y updatedAt automaticamente
});

//Indices para mejorar la performance
userSchema.index({ email: 1});
userSchema.index({ token: 1});

//Metodos del modelo
//Incrementa el numero de votos realizados y actualiza la fecha del ultimo voto
userSchema.methods.incrementarVotos = function() {
  this.votosRealizados += 1;
  this.ultimoVoto = new Date();
  return this.save();
};

//Verifica si el usuario puede votar
userSchema.methods.puedeVotar = function() {
  if (!this.activo) return false;

  //Si no ha votado, puede votar
  if (!this.ultimoVoto) return true;

  //Si ha votado, verifica si han pasado 24 horas
  const horasDesdeUltimoVoto = (Date.now() - this.ultimoVoto.getTime()) / (1000 * 60 * 60);
  return horasDesdeUltimoVoto >= 24;
};

//Creo el modelo de usuario
const User = mongoose.model<IUser>('User', userSchema);

export default User;
