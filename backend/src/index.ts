import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';

//importo las rutas
import userRoutes from './routes/userRoutes';
import matchRoutes from './routes/matchRoutes';
import adminRoutes from './routes/adminRoutes';
import voteRoutes from './routes/voteRoutes';

// Cargar variables de entorno
dotenv.config();

// Configuración de Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// Ruta para test y desarollador frontend
app.get('/', (req, res) => {
  res.json({ message: 'API de votacion del jugador del partido.',
    version: '1.0.0',
    endpoints: {
      user: '/api/user',
      match: '/api/match',
      admin: '/api/admin',
      vote: '/api/vote'
    }
  });
});

// Rutas de la API
app.use('/api/user', userRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/admin', adminRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🧙‍♂️ Servidor corriendo en el puerto ${PORT}`);
});