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

// Rutas
app.get('/', (req, res) => {
  res.json({ message: 'API de votacion del jugador del partido.'});
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🧙‍♂️ Servidor corriendo en el puerto ${PORT}`);
});