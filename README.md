# AnimeTracker API

Backend de AnimeTracker, una aplicacion full-stack para gestionar biblioteca personal de anime, favoritos, perfiles publicos y estadisticas de consumo.

El proyecto esta construido como pieza de portafolio profesional, con una arquitectura separada entre frontend, backend y base de datos. Actualmente el MVP funciona en entorno local y esta preparado para una etapa posterior de despliegue.

## Estado del Proyecto

- MVP funcional en entorno local.
- API REST documentada con Swagger.
- Backend cubierto con pruebas unitarias e integracion.
- Flujo end-to-end validado desde el frontend con Playwright.
- Despliegue en produccion en VPS propia.

## Funcionalidades

- Registro, login y logout logico con JWT.
- Recuperacion y restablecimiento de contrasena mediante token temporal.
- Perfil privado editable y perfil publico por username.
- Busqueda y detalle de anime usando Kitsu como proveedor externo.
- Persistencia local de animes consultados.
- Biblioteca personal con estados, progreso, score, fechas y notas.
- Favoritos de usuario.
- Estadisticas basicas de biblioteca y consumo.
- Validacion de datos con Zod.
- Manejo centralizado de errores y respuestas consistentes.
- Documentacion interactiva de API con Swagger UI.

## Stack Tecnico

### Backend

- Node.js
- Express
- PostgreSQL
- Prisma ORM
- Zod
- JWT
- bcrypt
- Multer
- Cloudinary
- Swagger UI
- Vitest
- Supertest
- Docker Compose

### Frontend

El frontend vive en un proyecto separado: `AnimeTracker-Front`.

- React
- Vite
- TypeScript
- React Router
- TanStack Query
- Zustand
- Tailwind CSS
- Vitest
- Testing Library
- Playwright

## Arquitectura

AnimeTracker usa una arquitectura cliente-servidor con responsabilidades separadas:

- Frontend: interfaz, navegacion, estado de sesion y consumo de API.
- Backend: reglas de negocio, autenticacion, validacion, integracion externa y API REST.
- Base de datos: persistencia con PostgreSQL y Prisma.

La estructura del backend sigue una separacion por capas:

```text
src/
  config/
  controllers/
  docs/
  middlewares/
  repositories/
  routes/
  schemas/
  services/
  utils/
```

El frontend no consume directamente la API externa de anime. El backend centraliza la integracion con Kitsu para normalizar datos, aplicar reglas de negocio y persistir informacion relevante.

## Requisitos

- Node.js 20 o superior.
- npm.
- Docker y Docker Compose.
- PostgreSQL local o mediante Docker Compose.

## Configuracion Local

1. Clonar el repositorio e instalar dependencias:

```bash
npm install
```

2. Crear el archivo de variables de entorno:

```bash
cp .env.example .env
```

3. Ajustar las variables segun el entorno local:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/animetracker?schema=public"
DATABASE_URL_TEST="postgresql://postgres:postgres@localhost:5432/animetracker_test?schema=public"
JWT_SECRET="change-me"
JWT_EXPIRES_IN="1d"
CORS_ORIGIN="http://localhost:5173"
ANIME_PROVIDER="kitsu"
KITSU_BASE_URL="https://kitsu.io/api/edge"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

4. Levantar servicios con Docker Compose:

```bash
docker compose up -d
```

5. Generar Prisma Client:

```bash
npm run prisma:generate
```

6. Aplicar migraciones en desarrollo:

```bash
npm run prisma:migrate
```

7. Ejecutar el backend en modo desarrollo:

```bash
npm run dev
```

La API queda disponible en:

```text
http://localhost:3000
```

## Scripts

```bash
npm run dev              # Ejecuta el servidor con nodemon
npm start                # Ejecuta el servidor con Node.js
npm run prisma:generate  # Genera Prisma Client
npm run prisma:migrate   # Ejecuta migraciones en desarrollo
npm test                 # Ejecuta toda la suite de tests
npm run test:unit        # Ejecuta tests unitarios
npm run test:integration # Ejecuta tests de integracion
```

## Documentacion de API

Swagger UI esta disponible localmente en:

```text
http://localhost:3000/api/docs
```

Health check:

```http
GET /health
```

Base path principal:

```text
/api
```

Grupos principales de endpoints:

- `/api/auth`
- `/api/users`
- `/api/anime`
- `/api/home`
- `/api/library`
- `/api/favorites`
- `/api/statistics`

## Testing

El backend usa Vitest y Supertest.

```bash
npm test
npm run test:unit
npm run test:integration
```

Los tests de integracion requieren una base de datos de testing separada mediante `DATABASE_URL_TEST`. El proyecto incluye una proteccion para evitar ejecutar integracion contra una base que no parezca de testing.

El flujo end-to-end se ejecuta desde el proyecto frontend:

```bash
npm run test:e2e
```

## Frontend

El frontend se encuentra en el proyecto hermano `AnimeTracker-Front`.

Comandos principales del frontend:

```bash
npm install
npm run dev
npm test
npm run build
npm run test:e2e
```

Por defecto, el backend permite CORS desde:

```text
http://localhost:5173
```

## Variables de Entorno

| Variable | Descripcion |
|---|---|
| `NODE_ENV` | Entorno de ejecucion. |
| `PORT` | Puerto HTTP del backend. |
| `DATABASE_URL` | Conexion principal de PostgreSQL. |
| `DATABASE_URL_TEST` | Conexion de PostgreSQL para tests de integracion. |
| `JWT_SECRET` | Secreto para firmar tokens JWT. |
| `JWT_EXPIRES_IN` | Tiempo de expiracion del JWT. |
| `CORS_ORIGIN` | Origen permitido para el frontend. |
| `ANIME_PROVIDER` | Proveedor activo de anime. |
| `KITSU_BASE_URL` | URL base de Kitsu API. |
| `CLOUDINARY_CLOUD_NAME` | Cloud name de Cloudinary. |
| `CLOUDINARY_API_KEY` | API key de Cloudinary. |
| `CLOUDINARY_API_SECRET` | API secret de Cloudinary. |

## Alcance Actual

Este repositorio representa el backend del MVP de AnimeTracker. Esta etapa prioriza arquitectura limpia, API consistente, cobertura de pruebas y funcionamiento local verificable.

Pendiente para una version publica:

- Despliegue del backend.
- Despliegue del frontend.
- Configuracion de variables de produccion.
- Ajustes finales de seguridad para entorno productivo.
- Documentacion final de setup full-stack en produccion.

## Autor

Proyecto desarrollado como aplicacion full-stack de portafolio.
