# 🏉 MVPV Backend - Rugby MVP Voting System API

<div align="center">

**API REST robusta y escalable para sistema de votación MVP en rugby**

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express.js-5.1.0-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.17.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Firebase](https://img.shields.io/badge/Firebase%20Admin-13.5.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=white)](https://firebase.google.com/)

[🚀 API Demo](#-api-endpoints) • [📖 Documentación](#-arquitectura-y-patrones) • [🛠️ Instalación](#-instalación) • [👨‍💻 Autor](#-autor)

</div>

---

## 📋 Tabla de Contenidos

- [🎯 Acerca del Proyecto](#-acerca-del-proyecto)
- [✨ Características Backend](#-características-backend)
- [🛠️ Stack Tecnológico](#️-stack-tecnológico)
- [🏗️ Arquitectura y Patrones](#️-arquitectura-y-patrones)
- [🚀 Instalación](#-instalación)
- [📚 API Endpoints](#-api-endpoints)
- [🔒 Seguridad](#-seguridad)
- [📊 Base de Datos](#-base-de-datos)
- [🧪 Testing y Calidad](#-testing-y-calidad)
- [🚀 Deployment](#-deployment)
- [🤝 Contribución](#-contribución)
- [👨‍💻 Autor](#-autor)

---

## 🎯 Acerca del Proyecto

**MVPV Backend** es una API REST completa y robusta desarrollada en Node.js con TypeScript que gestiona todo el sistema de votación MVP para equipos de rugby. Implementa arquitectura de microservicios, patrones de diseño avanzados y mejores prácticas de seguridad para crear una base sólida y escalable.

### 🎮 Funcionalidades Principales del Backend

- **🔐 Sistema de Autenticación Dual**: JWT + Firebase Admin SDK con refresh tokens
- **🗄️ Arquitectura de Datos Robusta**: MongoDB con Mongoose ODM y relaciones optimizadas
- **📧 Sistema de Notificaciones**: Emails transaccionales con templates HTML profesionales
- **🛡️ Seguridad Avanzada**: Encriptación bcrypt, validaciones, rate limiting y middleware de autenticación
- **⚡ API REST Optimizada**: Endpoints RESTful con validación de datos y manejo de errores centralizado
- **📊 Sistema de Votación**: Lógica de negocio compleja con validaciones temporales y estadísticas en tiempo real
- **🔄 Patrones de Diseño**: DAO, Service Layer, Repository Pattern y separación de responsabilidades

---

## ✨ Características Backend

### 🔐 Autenticación y Autorización
- **JWT Authentication** con tokens seguros y expiración configurable
- **Firebase Admin SDK Integration** para autenticación social (Google)
- **Dual Provider System** (Local + Google) con sincronización automática
- **Password Recovery System** con tokens temporales y emails seguros
- **Role-based Access Control** (Admin/User) con middleware de autorización
- **Session Management** con invalidación de tokens

### 🗄️ Gestión de Datos
- **MongoDB con Mongoose ODM** para modelado de datos robusto
- **Schema Validation** con validaciones a nivel de base de datos
- **Database Indexing** para optimización de consultas
- **Relationships Management** entre Users, Players, Matches y Votes
- **Data Aggregation** para estadísticas complejas
- **Connection Pooling** y manejo de desconexiones

### 📧 Sistema de Comunicaciones
- **Email Service Abstraction** con soporte múltiples proveedores (SMTP/Brevo)
- **HTML Email Templates** profesionales y responsive
- **Transactional Emails** (confirmación de voto, recuperación de contraseña)
- **Email Queue System** para envíos masivos
- **Template Engine** personalizado para emails dinámicos

### 🗳️ Lógica de Negocio Avanzada
- **Voting System Logic** con validaciones temporales (24h cooldown)
- **Real-time Statistics** con agregaciones MongoDB
- **Business Rules Engine** para validaciones de negocio
- **Data Integrity** con transacciones y rollbacks
- **Audit Trail** para tracking de cambios
- **Performance Optimization** con índices y consultas optimizadas

### 🛡️ Seguridad y Validación
- **Input Validation** en todas las rutas con sanitización
- **SQL Injection Prevention** (NoSQL injection protection)
- **XSS Protection** con sanitización de datos
- **Rate Limiting** implícito y explícito
- **CORS Configuration** segura
- **Environment Variables** para configuración segura

---

## 🛠️ Stack Tecnológico

### Core Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | 20+ | Runtime de JavaScript |
| **TypeScript** | 5.9.2 | Tipado estático y mejor DX |
| **Express.js** | 5.1.0 | Framework web minimalista |
| **MongoDB** | 8.17.0 | Base de datos NoSQL |
| **Mongoose** | 8.17.0 | ODM para MongoDB |

### Autenticación y Seguridad
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Firebase Admin SDK** | 13.5.0 | Autenticación social |
| **JWT** | 9.0.2 | Tokens de autenticación |
| **bcryptjs** | 3.0.2 | Encriptación de contraseñas |
| **Passport.js** | 0.7.0 | Estrategias de autenticación |

### Servicios Externos
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Nodemailer** | 7.0.6 | Cliente SMTP |
| **Brevo API** | 3.0.1 | Servicio de emails transaccionales |
| **CORS** | 2.8.5 | Configuración de CORS |

### Desarrollo y Calidad
| Herramienta | Versión | Propósito |
|-------------|---------|-----------|
| **ts-node** | 10.9.2 | Ejecución directa de TypeScript |
| **nodemon** | 3.1.10 | Desarrollo en tiempo real |
| **dotenv** | 17.2.1 | Gestión de variables de entorno |

---

## 🏗️ Arquitectura y Patrones

### 📁 Estructura del Proyecto
```
src/
├── config/           # Configuraciones centralizadas
│   ├── database.ts   # Configuración MongoDB
│   ├── firebase.ts   # Firebase Admin SDK
│   ├── jwt.ts        # JWT utilities
│   └── email.ts      # Email service config
├── dao/              # Data Access Objects
│   ├── UserDao.ts    # Acceso a datos de usuarios
│   ├── PlayerDao.ts  # Acceso a datos de jugadores
│   ├── MatchDao.ts   # Acceso a datos de partidos
│   └── VoteDao.ts    # Acceso a datos de votos
├── middleware/       # Middlewares personalizados
│   └── auth.ts       # Autenticación y autorización
├── models/           # Modelos Mongoose
│   ├── User.ts       # Esquema de usuario
│   ├── Player.ts     # Esquema de jugador
│   ├── Match.ts      # Esquema de partido
│   └── Vote.ts       # Esquema de voto
├── routes/           # Rutas de la API
│   ├── authRoutes.ts # Rutas de autenticación
│   ├── userRoutes.ts # Rutas de usuarios
│   ├── playerRoutes.ts # Rutas de jugadores
│   ├── matchRoutes.ts # Rutas de partidos
│   ├── voteRoutes.ts # Rutas de votación
│   └── adminRoutes.ts # Rutas de administración
├── services/         # Lógica de negocio
│   ├── AuthService.ts # Servicio de autenticación
│   ├── UserService.ts # Servicio de usuarios
│   ├── PlayerService.ts # Servicio de jugadores
│   ├── MatchService.ts # Servicio de partidos
│   ├── VoteService.ts # Servicio de votación
│   ├── EmailService.ts # Servicio de emails
│   └── AdminService.ts # Servicio de administración
├── types/            # Definiciones TypeScript
│   ├── auth.types.ts # Tipos de autenticación
│   ├── user.types.ts # Tipos de usuario
│   ├── player.types.ts # Tipos de jugador
│   ├── match.types.ts # Tipos de partido
│   ├── vote.types.ts # Tipos de voto
│   └── email.types.ts # Tipos de email
└── index.ts          # Punto de entrada
```

### 🔄 Patrones de Diseño Implementados

#### **1. DAO Pattern (Data Access Object)**
```typescript
// Ejemplo: UserDao.ts
export class UserDao {
  async createUser(userData: IUser): Promise<IUser> {
    // Lógica de acceso a datos encapsulada
  }
  
  async findByEmail(email: string): Promise<IUser | null> {
    // Consultas optimizadas con índices
  }
}
```

#### **2. Service Layer Pattern**
```typescript
// Ejemplo: AuthService.ts
export class AuthService {
  private userService: UserService;
  private adminService: AdminService;
  
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Lógica de negocio compleja
  }
}
```

#### **3. Repository Pattern (implícito en DAOs)**
- Separación clara entre lógica de negocio y acceso a datos
- Abstracción de la capa de persistencia
- Facilita testing y mantenimiento

#### **4. Middleware Pattern**
```typescript
// Ejemplo: auth.ts
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Middleware de autenticación reutilizable
};
```

#### **5. Factory Pattern (Email Service)**
```typescript
// Soporte múltiples proveedores de email
if (process.env.EMAIL_SERVICE === 'brevo') {
  // Implementación Brevo
} else {
  // Implementación SMTP tradicional
}
```

### 🚀 Flujo de Datos y Arquitectura

```mermaid
graph TD
    A[Cliente Frontend] --> B[Express Router]
    B --> C[Middleware Auth]
    C --> D[Service Layer]
    D --> E[DAO Layer]
    E --> F[Mongoose Models]
    F --> G[MongoDB]
    
    H[Firebase Admin] --> C
    I[JWT Tokens] --> C
    J[Email Service] --> D
    K[Brevo API] --> J
```

### 📊 Optimizaciones de Performance

- **Database Indexing**: Índices estratégicos en campos de consulta frecuente
- **Connection Pooling**: Pool de conexiones MongoDB optimizado
- **Query Optimization**: Agregaciones eficientes para estadísticas
- **Caching Strategy**: Preparado para implementación de Redis
- **Compression**: Middleware de compresión para responses

---

## 🚀 Instalación

### Prerrequisitos
- Node.js (versión 20 o superior)
- MongoDB (local o Atlas)
- Cuenta de Firebase (para autenticación)
- Cuenta de Brevo (para emails)

### 1. Clonar el Repositorio
```bash
git clone https://github.com/Comagol/mvpv-backend.git
cd mvpv-backend
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
Crear archivo `.env` en la raíz del proyecto:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/mvpv
# o para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/mvpv

# JWT
JWT_SECRET=tu_jwt_secret_super_seguro
JWT_EXPIRES_IN=24h

# Firebase Admin SDK
FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\ntu_private_key\n-----END PRIVATE KEY-----\n"

# Email Configuration
EMAIL_SERVICE=brevo
EMAIL_USER=tu_email@gmail.com
EMAIL_FROM=noreply@tudominio.com
BREVO_API_KEY=tu_brevo_api_key

# Application
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 4. Configurar Firebase
1. Crear proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Generar clave de servicio privada
3. Habilitar Authentication con Email/Password y Google

### 5. Configurar MongoDB
```bash
# Opción 1: MongoDB Local
mongod

# Opción 2: MongoDB Atlas (recomendado)
# Crear cluster en https://cloud.mongodb.com/
```

### 6. Ejecutar en Desarrollo
```bash
# Modo desarrollo con hot reload
npm run dev

# Modo producción
npm run build
npm start
```

### 7. Verificar Instalación
```bash
# Verificar que el servidor esté corriendo
curl http://localhost:3001/api/health
```

---

## 📚 API Endpoints

### 🔐 Autenticación
```typescript
POST   /api/auth/login              # Login tradicional
POST   /api/auth/firebase-login     # Login con Firebase
POST   /api/auth/forgot-password    # Solicitar recuperación
GET    /api/auth/verify-reset-token/:token # Verificar token
POST   /api/auth/reset-password     # Resetear contraseña
```

### 👥 Usuarios
```typescript
GET    /api/users                   # Listar usuarios (Admin)
GET    /api/users/:id               # Obtener usuario
PUT    /api/users/:id               # Actualizar usuario
DELETE /api/users/:id               # Eliminar usuario (Admin)
POST   /api/users/register          # Registro de usuario
```

### 🏃‍♂️ Jugadores
```typescript
GET    /api/players                 # Listar jugadores
GET    /api/players/:id             # Obtener jugador
POST   /api/players                 # Crear jugador (Admin)
PUT    /api/players/:id             # Actualizar jugador (Admin)
DELETE /api/players/:id             # Eliminar jugador (Admin)
GET    /api/players/active          # Jugadores activos
```

### ⚽ Partidos
```typescript
GET    /api/matches                 # Listar partidos
GET    /api/matches/:id             # Obtener partido
POST   /api/matches                 # Crear partido (Admin)
PUT    /api/matches/:id             # Actualizar partido (Admin)
DELETE /api/matches/:id             # Eliminar partido (Admin)
GET    /api/matches/active          # Partidos activos
PUT    /api/matches/:id/start       # Iniciar partido (Admin)
PUT    /api/matches/:id/finish      # Finalizar partido (Admin)
```

### 🗳️ Votación
```typescript
POST   /api/votes                   # Crear voto
GET    /api/votes/match/:matchId    # Votos de un partido
GET    /api/votes/match/:matchId/stats # Estadísticas del partido
GET    /api/votes/match/:matchId/top3  # Top 3 jugadores
GET    /api/votes/match/:matchId/winner # Ganador del partido
GET    /api/votes/user/:userId      # Historial de votos del usuario
```

### 👨‍💼 Administración
```typescript
GET    /api/admin/dashboard         # Dashboard admin
GET    /api/admin/statistics        # Estadísticas generales
GET    /api/admin/users             # Gestión de usuarios
PUT    /api/admin/users/:id/toggle  # Activar/desactivar usuario
```

### 📊 Ejemplo de Response
```json
{
  "success": true,
  "data": {
    "match": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "fecha": "2024-01-15T15:00:00.000Z",
      "estado": "en_proceso",
      "rival": "Club Atlético",
      "jugadores": [...],
      "votos": [
        {
          "playerId": "64f1a2b3c4d5e6f7g8h9i0j2",
          "playerName": "Juan Pérez",
          "totalVotos": 45,
          "porcentaje": 35.2
        }
      ]
    }
  },
  "message": "Partido obtenido exitosamente"
}
```

---

## 🔒 Seguridad

### 🛡️ Medidas Implementadas

#### **Autenticación Multi-Capa**
- JWT con firma HMAC SHA-256
- Firebase Admin SDK para autenticación social
- Refresh tokens con rotación automática
- Middleware de autenticación en todas las rutas protegidas

#### **Autorización Basada en Roles**
```typescript
// Middleware de autorización
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado' });
  }
  next();
};
```

#### **Validación y Sanitización**
- Validación de entrada en todas las rutas
- Sanitización de datos para prevenir XSS
- Validación de esquemas Mongoose
- Rate limiting implícito (1 voto/24h por usuario)

#### **Encriptación de Datos**
- Contraseñas encriptadas con bcrypt (salt rounds: 10)
- Tokens JWT firmados con clave secreta
- Variables de entorno para datos sensibles

#### **Protección de Base de Datos**
- Índices únicos para prevenir duplicados
- Validaciones a nivel de esquema
- Protección contra NoSQL injection
- Transacciones para operaciones críticas

### 🔐 Configuración de Seguridad

```typescript
// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security Headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
```

---

## 📊 Base de Datos

### 🗄️ Esquemas y Relaciones

#### **Users Collection**
```typescript
{
  _id: ObjectId,
  email: String (unique, indexed),
  nombre: String,
  password: String (hashed),
  firebaseUid: String (unique, sparse),
  provider: String (enum: ['local', 'google']),
  avatar: String,
  fechaRegistro: Date,
  ultimoVoto: Date,
  votosRealizados: Number,
  activo: Boolean,
  token: String (for password reset),
  tokenExpires: Date
}
```

#### **Players Collection**
```typescript
{
  _id: ObjectId,
  nombre: String,
  apodo: String,
  posicion: String (enum: 15 posiciones de rugby),
  imagen: String,
  camiseta: Number (1-23),
  activo: Boolean,
  camada: Number,
  fechaRegistro: Date
}
```

#### **Matches Collection**
```typescript
{
  _id: ObjectId,
  fecha: Date,
  estado: String (enum: ['programado', 'en_proceso', 'finalizado']),
  jugadores: [ObjectId] (ref: Player),
  ganador: ObjectId (ref: Player),
  descripcion: String,
  rival: String
}
```

#### **Votes Collection**
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  playerId: ObjectId (ref: Player),
  matchId: ObjectId (ref: Match),
  fechaVoto: Date,
  token: String (optional)
}
```

### 📈 Índices Optimizados

```typescript
// Users
userSchema.index({ email: 1 });
userSchema.index({ token: 1 });

// Players
playerSchema.index({ nombre: 1, camada: 1 });
playerSchema.index({ camada: 1 });

// Matches
matchSchema.index({ fecha: 1 });
matchSchema.index({ estado: 1 });

// Votes
voteSchema.index({ userId: 1, matchId: 1 }, { unique: true });
```

### 🔍 Consultas Optimizadas

```typescript
// Estadísticas de partido con agregación
const stats = await Vote.aggregate([
  { $match: { matchId: new ObjectId(matchId) } },
  { $group: {
    _id: '$playerId',
    totalVotos: { $sum: 1 }
  }},
  { $sort: { totalVotos: -1 }},
  { $limit: 3 }
]);
```

---

## 🧪 Testing y Calidad

### 🔬 Estrategia de Testing (Preparado para implementar)

#### **Unit Tests**
- Services layer con mocks de DAO
- Validaciones de modelos Mongoose
- Utilidades y helpers

#### **Integration Tests**
- Endpoints de API con base de datos de prueba
- Flujos completos de autenticación
- Sistema de votación end-to-end

#### **Performance Tests**
- Carga de consultas MongoDB
- Tiempo de respuesta de endpoints
- Memory leaks detection

### 📊 Métricas de Calidad

```typescript
// Ejemplo de test unitario (preparado)
describe('VoteService', () => {
  it('should validate 24h cooldown', async () => {
    const user = await createTestUser();
    await createTestVote(user._id);
    
    const canVote = await voteService.canUserVote(user._id, matchId);
    expect(canVote).toBe(false);
  });
});
```

---

## 🚀 Deployment

### 🐳 Docker Configuration (Preparado)

```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

### ☁️ Variables de Entorno para Producción

```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/mvpv
JWT_SECRET=super_secret_jwt_key_production
FIREBASE_PROJECT_ID=production-project-id
EMAIL_SERVICE=brevo
BREVO_API_KEY=production_brevo_key
FRONTEND_URL=https://tudominio.com
```

### 🌐 Plataformas de Deployment

- **Heroku**: Configuración con Procfile
- **Railway**: Deploy automático con GitHub
- **DigitalOcean**: Droplet con PM2
- **AWS/GCP**: Container con Docker
- **Vercel**: Serverless functions

---

## 🤝 Contribución

### 🚀 Guías de Contribución

1. **Fork** el repositorio
2. **Crea** una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. **Sigue** las convenciones de código establecidas
4. **Añade** tests para nuevas funcionalidades
5. **Commit** con mensajes descriptivos (`git commit -m 'feat: add user authentication'`)
6. **Push** a tu rama (`git push origin feature/amazing-feature`)
7. **Abre** un Pull Request

### 📝 Convenciones de Código

```typescript
// Interfaces con prefijo I
interface IUser extends Document {
  email: string;
  nombre: string;
}

// Clases con PascalCase
export class UserService {
  // Métodos con camelCase
  async createUser(userData: IUser): Promise<IUser> {
    // Implementación
  }
}

// Constantes en UPPER_CASE
const JWT_SECRET = process.env.JWT_SECRET;
```

### 🧪 Testing Requirements

- **Coverage mínimo**: 80% para servicios críticos
- **Unit tests**: Para toda la lógica de negocio
- **Integration tests**: Para endpoints principales
- **E2E tests**: Para flujos completos

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

**Francisco Comabella**
- 💼 LinkedIn: [linkedin.com/in/francisco-comabella-22a61b20b](https://www.linkedin.com/in/francisco-comabella-22a61b20b/)
- 📧 Email: comabellafrancisco@gmail.com
- 🐙 GitHub: [@Comagol](https://github.com/Comagol)

### 🎯 Sobre el Desarrollo

Este backend fue desarrollado como parte de mi proceso de aprendizaje en tecnologías modernas de desarrollo web. Cada línea de código representa mi compromiso con las mejores prácticas y la construcción de software robusto y escalable.

**Tecnologías que estoy dominando:**
- Arquitectura de APIs REST con Node.js y Express
- Programación con TypeScript y tipado estático
- Diseño de bases de datos NoSQL con MongoDB
- Implementación de sistemas de autenticación seguros
- Patrones de diseño y arquitectura de software
- Integración de servicios externos (Firebase, Brevo)

---

<div align="center">

### 🌟 Si te gusta este proyecto, ¡dale una estrella! ⭐

**Desarrollado con ❤️ y mucho ☕**

[⬆️ Volver al inicio](#-mvpv-backend---rugby-mvp-voting-system-api)

</div>