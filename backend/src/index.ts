import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';

//importo todas las rutas
import userRoutes from './routes/userRoutes';
import matchRoutes from './routes/matchRoutes';
import voteRoutes from './routes/voteRoutes';
import adminRoutes from './routes/adminRoutes';

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
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/admin', adminRoutes);

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