import mongoose from 'mongoose';
import dotenv from 'dotenv';

//Cargar variables de entorno
dotenv.config();

//URL de conexión a MongoDB
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/votacion';

// Debug: Verificar variables de entorno
console.log('🔍 Variables de entorno:');
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI final:', MONGO_URI);

//Funcion para conectar a MongoDB 
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

// Manejar eventos de conexion
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Desconectado de MongoDB');
});

mongoose.connection.on('error', (error) => {
  console.log('❌ Error de conexión a MongoDB', error);
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔴 MongoDB desconectado');
  process.exit(0);
});