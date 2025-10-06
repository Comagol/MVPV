# 🏉 MVPV - Sistema de Votación de Rugby

> **Estado del Proyecto**: 🚧 En desarrollo activo - Primera etapa  
> **Objetivo**: Aprender y aplicar tecnologías modernas mientras construyo una aplicación real

## 📋 Descripción

MVPV es un sistema completo de votación para equipos de rugby que permite a los usuarios votar por sus jugadores favoritos en diferentes partidos. El proyecto está diseñado con una arquitectura robusta y escalable, implementando las mejores prácticas de desarrollo web moderno.

### 🎯 Funcionalidades Principales

- **🔐 Autenticación Completa**
  - Registro e inicio de sesión tradicional
  - Autenticación con Google (Firebase Auth)
  - Recuperación de contraseña por email
  - Sistema de roles (Usuario/Admin)

- **🗳️ Sistema de Votación**
  - Votación por jugadores en partidos específicos
  - Límite de 1 voto por usuario cada 24 horas
  - Estadísticas en tiempo real
  - Historial de votos

- **👥 Gestión de Usuarios**
  - Perfiles de usuario completos
  - Seguimiento de actividad de votación
  - Sistema de administración

- **🏃‍♂️ Gestión de Jugadores**
  - Base de datos completa de jugadores
  - Información detallada (posición, camada, número de camiseta)
  - Estados de actividad

- **📧 Sistema de Notificaciones**
  - Emails de confirmación de voto
  - Recuperación de contraseña
  - Templates HTML profesionales

## 🛠️ Stack Tecnológico

### Backend
- **Node.js** con **TypeScript** - Runtime y tipado estático
- **Express.js** - Framework web robusto
- **MongoDB** con **Mongoose** - Base de datos NoSQL y ODM
- **Firebase Admin SDK** - Autenticación y servicios de Google
- **JWT** - Tokens de autenticación seguros
- **bcryptjs** - Encriptación de contraseñas
- **Nodemailer** + **Brevo API** - Servicio de emails transaccionales

### Arquitectura
- **Patrón MVC** - Separación clara de responsabilidades
- **DAO Pattern** - Capa de acceso a datos
- **Service Layer** - Lógica de negocio
- **Middleware de Autenticación** - Seguridad de rutas
- **TypeScript Interfaces** - Tipado fuerte en toda la aplicación

### Herramientas de Desarrollo
- **TypeScript** - Tipado estático y mejor DX
- **Nodemon** - Desarrollo en tiempo real
- **ts-node** - Ejecución directa de TypeScript
- **ESLint** - Calidad de código

## 📁 Estructura del Proyecto

```
src/
├── config/           # Configuraciones (DB, Firebase, JWT, Email)
├── dao/             # Data Access Objects (capa de datos)
├── middleware/      # Middlewares de autenticación
├── models/          # Modelos de MongoDB con Mongoose
├── routes/          # Rutas de la API REST
├── services/        # Lógica de negocio
├── types/           # Interfaces TypeScript
└── index.ts         # Punto de entrada de la aplicación
```

## 🚀 Características Técnicas Destacadas

### 🔒 Seguridad
- Encriptación de contraseñas con bcrypt
- Tokens JWT seguros con expiración
- Validación de entrada en todas las rutas
- Middleware de autenticación robusto
- Rate limiting implícito (1 voto/24h)

### 📊 Base de Datos
- Esquemas Mongoose optimizados con índices
- Relaciones entre colecciones (Users, Players, Matches, Votes)
- Métodos personalizados en modelos
- Validaciones a nivel de esquema

### 🌐 API REST
- Endpoints organizados por funcionalidad
- Respuestas consistentes con códigos HTTP apropiados
- Manejo centralizado de errores
- Documentación implícita en rutas

### 📧 Sistema de Emails
- Templates HTML profesionales
- Soporte para múltiples proveedores (SMTP/Brevo)
- Emails transaccionales (confirmación, recuperación)
- Fallback a texto plano

## 🎓 Lo que estoy aprendiendo

Este proyecto me está permitiendo profundizar en:

- **Arquitectura de Software**: Patrones de diseño y separación de responsabilidades
- **Seguridad Web**: Autenticación, autorización y mejores prácticas
- **Bases de Datos**: Modelado de datos y optimización de consultas
- **APIs RESTful**: Diseño de endpoints y manejo de estados
- **TypeScript**: Tipado estático y interfaces avanzadas
- **Integración de Servicios**: Firebase, MongoDB, servicios de email

## 🛣️ Roadmap

### ✅ Completado
- [x] Estructura base del proyecto
- [x] Sistema de autenticación completo
- [x] Modelos de base de datos
- [x] API REST básica
- [x] Sistema de votación
- [x] Servicio de emails

### 🚧 En Progreso
- [ ] Frontend (React/Next.js)
- [ ] Dashboard de administración
- [ ] Testing (Jest/Testing Library)
- [ ] Documentación de API (Swagger)

### 🔮 Futuro
- [ ] Sistema de notificaciones push
- [ ] Analytics avanzados
- [ ] Mobile app (React Native)
- [ ] Integración con redes sociales

## 🚀 Instalación y Uso

```bash
# Clonar el repositorio
git clone <tu-repo>
cd MVPV

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build
npm start
```

## 📝 Variables de Entorno Requeridas

```env
# Base de datos
MONGODB_URI=mongodb://localhost:27017/votacion

# Firebase
FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_CLIENT_EMAIL=tu-client-email
FIREBASE_PRIVATE_KEY=tu-private-key

# JWT
JWT_SECRET=tu-jwt-secret

# Email
EMAIL_SERVICE=brevo
EMAIL_USER=tu-email
EMAIL_FROM=noreply@tudominio.com
BREVO_API_KEY=tu-brevo-key

# Frontend
FRONTEND_URL=http://localhost:3000
```

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Este es un proyecto de aprendizaje, así que cualquier sugerencia, mejora o corrección es muy apreciada.

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

**💡 Nota**: Este proyecto está en su primera etapa de desarrollo y representa mi proceso de aprendizaje en el desarrollo web moderno. Cada línea de código es una oportunidad de crecimiento y mejora.

*Construido con ❤️ y mucho ☕*
