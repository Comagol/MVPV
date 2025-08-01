import mongoose from 'mongoose';
import dotenv from 'dotenv';

//Cargar variables de entorno
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/votacion';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB');
    console.log(`Base de datos:  ${mongoose.connection.name}`);
  } catch (error) {
    console.log('❌ Error al conectar a MongoDB', error);
    process.exit(1);
  }
};