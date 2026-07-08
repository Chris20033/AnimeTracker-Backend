const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'AnimeTracker API',
    version: '1.0.0',
    description: 'API REST para AnimeTracker.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development',
    },
  ],
  tags: [
    { name: 'Health', description: 'Estado del servicio' },
    { name: 'Auth', description: 'Autenticacion y sesion' },
    { name: 'Users', description: 'Perfil privado y publico de usuarios' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'VALIDATION_ERROR' },
              message: { type: 'string', example: 'Invalid request data' },
              details: {
                type: 'array',
                items: { type: 'object' },
              },
            },
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          username: { type: 'string', example: 'animefan' },
          email: { type: 'string', format: 'email', example: 'user@example.com' },
          role: { type: 'string', example: 'USER' },
          avatarUrl: { type: 'string', nullable: true, example: null },
          bannerUrl: { type: 'string', nullable: true, example: null },
          bio: { type: 'string', nullable: true, example: null },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          data: {
            type: 'object',
            properties: {
              user: { $ref: '#/components/schemas/User' },
              accessToken: { type: 'string', example: 'jwt-token' },
            },
          },
        },
      },
      PrivateProfile: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          username: { type: 'string', example: 'animefan' },
          email: { type: 'string', format: 'email', example: 'user@example.com' },
          role: { type: 'string', example: 'USER' },
          avatarUrl: { type: 'string', nullable: true, example: null },
          bannerUrl: { type: 'string', nullable: true, example: null },
          bio: { type: 'string', nullable: true, example: null },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      PublicProfile: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          username: { type: 'string', example: 'animefan' },
          avatarUrl: { type: 'string', nullable: true, example: null },
          bannerUrl: { type: 'string', nullable: true, example: null },
          bio: { type: 'string', nullable: true, example: null },
          favorites: { type: 'array', items: { type: 'object' } },
          statistics: {
            type: 'object',
            properties: {
              totalAnime: { type: 'number', example: 0 },
              completedAnime: { type: 'number', example: 0 },
              totalEpisodesWatched: { type: 'number', example: 0 },
              averageScore: { type: 'number', nullable: true, example: null },
            },
          },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Verifica el estado del backend',
        responses: {
          200: {
            description: 'Servicio disponible',
            content: {
              'application/json': {
                example: {
                  data: {
                    status: 'ok',
                    service: 'animetracker-api',
                    timestamp: '2026-06-24T10:00:00.000Z',
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registra un nuevo usuario',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'email', 'password'],
                properties: {
                  username: { type: 'string', minLength: 3, maxLength: 30, example: 'animefan' },
                  email: { type: 'string', format: 'email', example: 'user@example.com' },
                  password: { type: 'string', minLength: 8, example: 'password123' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Usuario creado', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
          400: { description: 'Datos invalidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          409: { description: 'Username o email duplicado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Inicia sesion con email y password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'user@example.com' },
                  password: { type: 'string', example: 'password123' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Sesion iniciada', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
          400: { description: 'Datos invalidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          401: { description: 'Credenciales invalidas', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          403: { description: 'Usuario inactivo', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Cierra sesion de forma logica',
        security: [{ bearerAuth: [] }],
        responses: {
          204: { description: 'Sesion cerrada' },
          401: { description: 'Token ausente o invalido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/auth/forgot-password': {
      post: {
        tags: ['Auth'],
        summary: 'Solicita recuperacion de password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'user@example.com' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Solicitud procesada sin revelar si el correo existe',
            content: {
              'application/json': {
                example: {
                  message: 'If the email exists, a recovery link will be sent',
                },
              },
            },
          },
          400: { description: 'Datos invalidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/auth/reset-password': {
      post: {
        tags: ['Auth'],
        summary: 'Restablece password usando token temporal',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['token', 'newPassword'],
                properties: {
                  token: { type: 'string', example: 'reset-token' },
                  newPassword: { type: 'string', minLength: 8, example: 'newPassword123' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Password actualizado',
            content: {
              'application/json': {
                example: {
                  message: 'Password updated successfully',
                },
              },
            },
          },
          400: { description: 'Token invalido, expirado o datos invalidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/auth/validate-reset-token': {
      post: {
        tags: ['Auth'],
        summary: 'Valida si un token de recuperacion sigue disponible',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['token'],
                properties: {
                  token: { type: 'string', example: 'reset-token' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Token valido',
            content: {
              'application/json': {
                example: {
                  data: {
                    valid: true,
                  },
                },
              },
            },
          },
          400: { description: 'Token invalido, expirado o usado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/users/me': {
      get: {
        tags: ['Users'],
        summary: 'Obtiene el perfil privado del usuario autenticado',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Perfil privado', content: { 'application/json': { schema: { type: 'object', properties: { data: { $ref: '#/components/schemas/PrivateProfile' } } } } } },
          401: { description: 'Token ausente o invalido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
      patch: {
        tags: ['Users'],
        summary: 'Actualiza el perfil privado del usuario autenticado',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: { type: 'string', minLength: 3, maxLength: 30, example: 'animefan' },
                  avatarUrl: { type: 'string', nullable: true, example: null },
                  bannerUrl: { type: 'string', nullable: true, example: null },
                  bio: { type: 'string', nullable: true, maxLength: 500, example: 'Watching seasonal anime.' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Perfil actualizado', content: { 'application/json': { schema: { type: 'object', properties: { data: { $ref: '#/components/schemas/User' } } } } } },
          400: { description: 'Datos invalidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          401: { description: 'Token ausente o invalido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          409: { description: 'Username duplicado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/users/{username}': {
      get: {
        tags: ['Users'],
        summary: 'Obtiene el perfil publico de un usuario',
        parameters: [
          {
            name: 'username',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Perfil publico', content: { 'application/json': { schema: { type: 'object', properties: { data: { $ref: '#/components/schemas/PublicProfile' } } } } } },
          404: { description: 'Usuario no encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
  },
};

module.exports = { openApiSpec };
