import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';


//interface para typescript
export interface IAdmin extends Document {
  email: string;
  password: string;
  nombre: string;
}

const adminSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  nombre: {
    type: String,
    requires: true,
    minLength: 5,
    maxLength: 50,
    trim: true
  }
}, {
  timestamps: true
});

//Usamos Index mediante el email
adminSchema.index({ email:1});

//Metodo para verificar password
adminSchema.methods.verificarPassword = async function (email: string): Promise<boolean> {
  return await bcrypt.compare(email, this.password);
}

//metodo statico para verificar el mail
adminSchema.statics.verificarMail = function (email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

//middleware para encriptar password
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error as Error);
  }
});

//Middleware para no devolver passwords en respuesta
adminSchema.methods.toJSON = function () {
  const adminObject = this.toObject();
  delete adminObject.password;
  return adminObject;
};

export default mongoose.model<IAdmin>('Admin', adminSchema);
