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
    { name: 'Anime', description: 'Busqueda y detalle de anime desde Jikan' },
    { name: 'Home', description: 'Contenido publico para la pagina principal' },
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
      AnimeSearchItem: {
        type: 'object',
        properties: {
          externalId: { type: 'string', example: '20' },
          source: { type: 'string', example: 'JIKAN' },
          title: { type: 'string', example: 'Naruto' },
          imageUrl: { type: 'string', nullable: true, example: 'https://cdn.myanimelist.net/images/anime/1141/142503l.webp' },
          type: { type: 'string', nullable: true, example: 'TV' },
          year: { type: 'number', nullable: true, example: 2002 },
          status: { type: 'string', nullable: true, example: 'Finished Airing' },
          score: { type: 'number', nullable: true, example: 8.02 },
        },
      },
      AnimeGenre: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Action' },
          count: { type: 'number', example: 4985 },
        },
      },
      AnimeDetail: {
        type: 'object',
        properties: {
          externalId: { type: 'string', example: '20' },
          source: { type: 'string', example: 'JIKAN' },
          title: { type: 'string', example: 'Naruto' },
          titleEnglish: { type: 'string', nullable: true, example: 'Naruto' },
          synopsis: { type: 'string', nullable: true, example: 'Twelve years ago, a colossal demon fox terrorized the world.' },
          imageUrl: { type: 'string', nullable: true, example: 'https://cdn.myanimelist.net/images/anime/1141/142503l.webp' },
          episodes: { type: 'number', nullable: true, example: 220 },
          duration: { type: 'string', nullable: true, example: '23 min per ep' },
          status: { type: 'string', nullable: true, example: 'Finished Airing' },
          type: { type: 'string', nullable: true, example: 'TV' },
          season: { type: 'string', nullable: true, example: 'fall' },
          year: { type: 'number', nullable: true, example: 2002 },
          score: { type: 'number', nullable: true, example: 8.02 },
          genres: { type: 'array', items: { type: 'string' }, example: ['Action', 'Adventure', 'Fantasy'] },
          studio: { type: 'string', nullable: true, example: 'Studio Pierrot' },
          airedFrom: { type: 'string', nullable: true, example: '2002-10-03T00:00:00+00:00' },
        },
      },
      HomeAnimeItem: {
        allOf: [
          { $ref: '#/components/schemas/AnimeSearchItem' },
          {
            type: 'object',
            properties: {
              synopsis: { type: 'string', nullable: true, example: 'Third season of Mushoku Tensei.' },
              episodes: { type: 'number', nullable: true, example: 12 },
              genres: { type: 'array', items: { type: 'string' }, example: ['Action', 'Fantasy'] },
              trailerUrl: { type: 'string', nullable: true, example: 'https://www.youtube.com/watch?v=example' },
              rank: { type: 'number', nullable: true, example: 1 },
              popularity: { type: 'number', nullable: true, example: 20 },
              members: { type: 'number', nullable: true, example: 250000 },
            },
          },
        ],
      },
      HomeRecommendationItem: {
        type: 'object',
        properties: {
          externalId: { type: 'string', example: '20' },
          source: { type: 'string', example: 'JIKAN' },
          title: { type: 'string', example: 'Naruto' },
          imageUrl: { type: 'string', nullable: true, example: 'https://cdn.myanimelist.net/images/anime/1141/142503l.webp' },
          recommendationUrl: { type: 'string', nullable: true, example: 'https://myanimelist.net/recommendations/anime/20-1735' },
          votes: { type: 'number', nullable: true, example: 4 },
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
    '/api/anime/search': {
      get: {
        tags: ['Anime'],
        summary: 'Busca anime usando Jikan API de forma publica',
        parameters: [
          {
            name: 'q',
            in: 'query',
            required: true,
            schema: { type: 'string', minLength: 1, maxLength: 100 },
            example: 'naruto',
          },
          {
            name: 'page',
            in: 'query',
            required: false,
            schema: { type: 'integer', minimum: 1, default: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            required: false,
            schema: { type: 'integer', minimum: 1, maximum: 25, default: 20 },
          },
        ],
        responses: {
          200: {
            description: 'Resultados de busqueda normalizados',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'array', items: { $ref: '#/components/schemas/AnimeSearchItem' } },
                    pagination: {
                      type: 'object',
                      properties: {
                        page: { type: 'number', example: 1 },
                        limit: { type: 'number', example: 20 },
                        total: { type: 'number', example: 30 },
                        totalPages: { type: 'number', example: 2 },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: 'Datos invalidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          500: { description: 'Fallo de API externa', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/anime/catalog': {
      get: {
        tags: ['Anime'],
        summary: 'Lista catalogo publico de anime con filtros',
        parameters: [
          { name: 'page', in: 'query', required: false, schema: { type: 'integer', minimum: 1, default: 1 } },
          { name: 'limit', in: 'query', required: false, schema: { type: 'integer', minimum: 1, maximum: 25, default: 24 } },
          { name: 'q', in: 'query', required: false, schema: { type: 'string', minLength: 1, maxLength: 100 }, example: 'one piece' },
          { name: 'type', in: 'query', required: false, schema: { type: 'string', enum: ['tv', 'movie', 'ova', 'special', 'ona', 'music', 'cm', 'pv', 'tv_special'] } },
          { name: 'status', in: 'query', required: false, schema: { type: 'string', enum: ['airing', 'complete', 'upcoming'] } },
          { name: 'rating', in: 'query', required: false, schema: { type: 'string', enum: ['g', 'pg', 'pg13', 'r17', 'r', 'rx'] } },
          { name: 'genres', in: 'query', required: false, schema: { type: 'string', pattern: '^\\d+(,\\d+)*$' }, example: '1,10' },
          { name: 'genres_exclude', in: 'query', required: false, schema: { type: 'string', pattern: '^\\d+(,\\d+)*$' }, example: '12' },
          { name: 'order_by', in: 'query', required: false, schema: { type: 'string', enum: ['mal_id', 'title', 'type', 'rating', 'start_date', 'end_date', 'episodes', 'score', 'scored_by', 'rank', 'popularity', 'members', 'favorites'], default: 'popularity' } },
          { name: 'sort', in: 'query', required: false, schema: { type: 'string', enum: ['asc', 'desc'], default: 'asc' } },
          { name: 'min_score', in: 'query', required: false, schema: { type: 'number', minimum: 0, maximum: 10 } },
          { name: 'max_score', in: 'query', required: false, schema: { type: 'number', minimum: 0, maximum: 10 } },
          { name: 'start_date', in: 'query', required: false, schema: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' }, example: '2020-01-01' },
          { name: 'end_date', in: 'query', required: false, schema: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' }, example: '2026-12-31' },
        ],
        responses: {
          200: {
            description: 'Catalogo normalizado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'array', items: { $ref: '#/components/schemas/AnimeSearchItem' } },
                    pagination: {
                      type: 'object',
                      properties: {
                        page: { type: 'number', example: 1 },
                        limit: { type: 'number', example: 24 },
                        total: { type: 'number', example: 100 },
                        totalPages: { type: 'number', example: 5 },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: 'Datos invalidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          500: { description: 'Fallo de API externa', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/anime/genres': {
      get: {
        tags: ['Anime'],
        summary: 'Lista generos publicos para filtros de catalogo',
        responses: {
          200: { description: 'Generos de anime', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/AnimeGenre' } } } } } } },
          500: { description: 'Fallo de API externa', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/anime/{source}/{externalId}': {
      get: {
        tags: ['Anime'],
        summary: 'Obtiene el detalle publico de un anime desde Jikan',
        parameters: [
          {
            name: 'source',
            in: 'path',
            required: true,
            schema: { type: 'string', enum: ['JIKAN'] },
          },
          {
            name: 'externalId',
            in: 'path',
            required: true,
            schema: { type: 'string', pattern: '^[1-9]\\d*$' },
            example: '20',
          },
        ],
        responses: {
          200: { description: 'Detalle normalizado', content: { 'application/json': { schema: { type: 'object', properties: { data: { $ref: '#/components/schemas/AnimeDetail' } } } } } },
          400: { description: 'Datos invalidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'Anime no encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          500: { description: 'Fallo de API externa', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/home': {
      get: {
        tags: ['Home'],
        summary: 'Obtiene contenido publico agregado para la pagina principal',
        responses: {
          200: {
            description: 'Contenido de portada normalizado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        hero: { $ref: '#/components/schemas/HomeAnimeItem' },
                        sections: {
                          type: 'object',
                          properties: {
                            featured: { type: 'array', items: { $ref: '#/components/schemas/HomeAnimeItem' } },
                            topAiring: { type: 'array', items: { $ref: '#/components/schemas/HomeAnimeItem' } },
                            seasonal: { type: 'array', items: { $ref: '#/components/schemas/HomeAnimeItem' } },
                            upcoming: { type: 'array', items: { $ref: '#/components/schemas/HomeAnimeItem' } },
                            popular: { type: 'array', items: { $ref: '#/components/schemas/HomeAnimeItem' } },
                            recommendations: { type: 'array', items: { $ref: '#/components/schemas/HomeRecommendationItem' } },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          500: { description: 'Fallo de API externa', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/home/featured': {
      get: { tags: ['Home'], summary: 'Animes destacados para hero/carrusel', responses: { 200: { description: 'Lista destacada', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/HomeAnimeItem' } } } } } } }, 500: { description: 'Fallo de API externa', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } } },
    },
    '/api/home/top-airing': {
      get: { tags: ['Home'], summary: 'Top animes en emision', responses: { 200: { description: 'Top airing', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/HomeAnimeItem' } } } } } } }, 500: { description: 'Fallo de API externa', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } } },
    },
    '/api/home/seasonal': {
      get: { tags: ['Home'], summary: 'Animes de temporada actual', responses: { 200: { description: 'Temporada actual', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/HomeAnimeItem' } } } } } } }, 500: { description: 'Fallo de API externa', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } } },
    },
    '/api/home/upcoming': {
      get: { tags: ['Home'], summary: 'Proximos estrenos', responses: { 200: { description: 'Proximos estrenos', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/HomeAnimeItem' } } } } } } }, 500: { description: 'Fallo de API externa', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } } },
    },
    '/api/home/popular': {
      get: { tags: ['Home'], summary: 'Animes populares', responses: { 200: { description: 'Populares', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/HomeAnimeItem' } } } } } } }, 500: { description: 'Fallo de API externa', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } } },
    },
    '/api/home/recommendations': {
      get: { tags: ['Home'], summary: 'Recomendaciones recientes de anime', responses: { 200: { description: 'Recomendaciones', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/HomeRecommendationItem' } } } } } } }, 500: { description: 'Fallo de API externa', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } } },
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
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  username: { type: 'string', minLength: 3, maxLength: 30, example: 'animefan' },
                  avatar: { type: 'string', format: 'binary' },
                  banner: { type: 'string', format: 'binary' },
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
