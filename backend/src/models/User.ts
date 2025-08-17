import mongoose, { Document, Schema, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

//Creo la interfaz para TypeScript
export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  nombre: string;
  password: string;
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
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 100
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

// Agregar método para verificar password
userSchema.methods.verificarPassword = async function(password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// Agregar middleware para encriptar password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Agregar middleware para no devolver password
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

//Creo y exporto el modelo de usuario
export const User = mongoose.model<IUser>('User', userSchema);
