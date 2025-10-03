import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import './config/firebase';

//importo todas las rutas
import userRoutes from './routes/userRoutes';
import matchRoutes from './routes/matchRoutes';
import voteRoutes from './routes/voteRoutes';
import adminRoutes from './routes/adminRoutes';
import playerRoutes from './routes/playerRoutes';

// ✅ VERIFICAR CARGA DE AUTHROUTES
console.log('📂 Cargando authRoutes...');
import authRoutes from './routes/authRoutes';
console.log('✅ authRoutes cargado exitosamente');

// Cargar variables de entorno
dotenv.config();

// Configuración de Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// Ruta simple para test
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Rutas de la API - todas las rutas
console.log('🛣️ Registrando rutas...');
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/auth', authRoutes);
console.log('✅ Todas las rutas registradas, incluyendo /api/auth');

// Iniciar servidor
const startServer = async () => {
  try {
    await connectDB();
    console.log('Base de datos conectada correctamente');

    app.listen(PORT, () => {
      console.log(`🧙‍♂️ Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.log('❌ Error al iniciar el servidor', error);
    process.exit(1);
  }
};

startServer();