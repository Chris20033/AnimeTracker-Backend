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
    { name: 'Anime', description: 'Busqueda y detalle de anime desde Kitsu' },
    { name: 'Home', description: 'Contenido publico para la pagina principal' },
    { name: 'Library', description: 'Biblioteca personal de anime' },
    { name: 'Favorites', description: 'Anime favoritos del usuario' },
    { name: 'Statistics', description: 'Estadisticas personales y publicas' },
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
          favorites: { type: 'array', items: { $ref: '#/components/schemas/FavoriteEntry' } },
          statistics: { $ref: '#/components/schemas/StatisticsSummary' },
        },
      },
      AnimeSearchItem: {
        type: 'object',
        properties: {
          externalId: { type: 'string', example: '7442' },
          source: { type: 'string', example: 'KITSU' },
          title: { type: 'string', example: 'Attack on Titan' },
          imageUrl: { type: 'string', nullable: true, example: 'https://media.kitsu.app/anime/poster_images/7442/large.jpg' },
          type: { type: 'string', nullable: true, example: 'TV' },
          year: { type: 'number', nullable: true, example: 2002 },
          status: { type: 'string', nullable: true, example: 'finished' },
          score: { type: 'number', nullable: true, example: 8.45 },
        },
      },
      AnimeGenre: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'action' },
          externalId: { type: 'string', example: '8' },
          name: { type: 'string', example: 'Action' },
          slug: { type: 'string', example: 'action' },
          count: { type: 'number', example: 2441 },
        },
      },
      AnimeDetail: {
        type: 'object',
        properties: {
          externalId: { type: 'string', example: '7442' },
          source: { type: 'string', example: 'KITSU' },
          title: { type: 'string', example: 'Attack on Titan' },
          titleEnglish: { type: 'string', nullable: true, example: 'Attack on Titan' },
          synopsis: { type: 'string', nullable: true, example: 'Centuries ago, mankind was slaughtered to near extinction by titans.' },
          imageUrl: { type: 'string', nullable: true, example: 'https://media.kitsu.app/anime/poster_images/7442/large.jpg' },
          episodes: { type: 'number', nullable: true, example: 25 },
          duration: { type: 'string', nullable: true, example: '23 min per ep' },
          status: { type: 'string', nullable: true, example: 'finished' },
          type: { type: 'string', nullable: true, example: 'TV' },
          season: { type: 'string', nullable: true, example: 'fall' },
          year: { type: 'number', nullable: true, example: 2013 },
          score: { type: 'number', nullable: true, example: 8.45 },
          genres: { type: 'array', items: { type: 'string' }, example: ['Action', 'Adventure', 'Fantasy'] },
          studio: { type: 'string', nullable: true, example: null },
          airedFrom: { type: 'string', nullable: true, example: '2013-04-07' },
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
          source: { type: 'string', example: 'KITSU' },
          title: { type: 'string', example: 'Naruto' },
          imageUrl: { type: 'string', nullable: true, example: 'https://media.kitsu.app/anime/poster_images/7442/large.jpg' },
          recommendationUrl: { type: 'string', nullable: true, example: null },
          votes: { type: 'number', nullable: true, example: 4 },
        },
      },
      LibraryAnime: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          externalId: { type: 'string', example: '7442' },
          source: { type: 'string', example: 'KITSU' },
          title: { type: 'string', example: 'Attack on Titan' },
          titleEnglish: { type: 'string', nullable: true, example: 'Attack on Titan' },
          imageUrl: { type: 'string', nullable: true, example: 'https://media.kitsu.app/anime/poster_images/7442/large.jpg' },
          episodes: { type: 'number', nullable: true, example: 25 },
          status: { type: 'string', nullable: true, example: 'finished' },
          type: { type: 'string', nullable: true, example: 'TV' },
          year: { type: 'number', nullable: true, example: 2013 },
          score: { type: 'number', nullable: true, example: 8.45 },
        },
      },
      LibraryEntry: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          status: { type: 'string', enum: ['WATCHING', 'COMPLETED', 'ON_HOLD', 'DROPPED', 'PLAN_TO_WATCH'], example: 'WATCHING' },
          episodesWatched: { type: 'number', example: 3 },
          personalScore: { type: 'number', nullable: true, example: 8 },
          notes: { type: 'string', nullable: true, example: 'Great pacing.' },
          startedAt: { type: 'string', format: 'date-time', nullable: true, example: '2026-07-01T00:00:00.000Z' },
          finishedAt: { type: 'string', format: 'date-time', nullable: true, example: null },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          anime: { $ref: '#/components/schemas/LibraryAnime' },
        },
      },
      FavoriteAnime: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          externalId: { type: 'string', example: '7442' },
          source: { type: 'string', example: 'KITSU' },
          title: { type: 'string', example: 'Attack on Titan' },
          titleEnglish: { type: 'string', nullable: true, example: 'Attack on Titan' },
          alternativeTitles: { type: 'array', items: { type: 'string' }, example: ['Attack on Titan', 'Shingeki no Kyojin'] },
          imageUrl: { type: 'string', nullable: true, example: 'https://media.kitsu.app/anime/poster_images/7442/large.jpg' },
          episodes: { type: 'number', nullable: true, example: 25 },
          status: { type: 'string', nullable: true, example: 'finished' },
          type: { type: 'string', nullable: true, example: 'TV' },
          year: { type: 'number', nullable: true, example: 2013 },
          score: { type: 'number', nullable: true, example: 8.45 },
        },
      },
      FavoriteEntry: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
          anime: { $ref: '#/components/schemas/FavoriteAnime' },
        },
      },
      StatisticsSummary: {
        type: 'object',
        properties: {
          totalAnime: { type: 'number', example: 3 },
          completedAnime: { type: 'number', example: 1 },
          totalEpisodesWatched: { type: 'number', example: 42 },
          averageScore: { type: 'number', nullable: true, example: 8.5 },
          topGenres: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Action' },
                count: { type: 'number', example: 2 },
              },
            },
          },
          statusDistribution: {
            type: 'object',
            properties: {
              WATCHING: { type: 'number', example: 1 },
              COMPLETED: { type: 'number', example: 1 },
              ON_HOLD: { type: 'number', example: 0 },
              DROPPED: { type: 'number', example: 0 },
              PLAN_TO_WATCH: { type: 'number', example: 1 },
            },
          },
        },
      },
      PublicStatisticsSummary: {
        allOf: [
          { $ref: '#/components/schemas/StatisticsSummary' },
          {
            type: 'object',
            properties: {
              username: { type: 'string', example: 'animefan' },
            },
          },
        ],
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
                  data: null,
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
                  data: null,
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
        summary: 'Busca anime usando Kitsu API de forma publica',
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
          429: { description: 'Rate limit de Kitsu', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          503: { description: 'Fallo temporal de API externa', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
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
          { name: 'status', in: 'query', required: false, schema: { type: 'string', enum: ['airing', 'current', 'complete', 'finished', 'upcoming'] } },
          { name: 'rating', in: 'query', required: false, schema: { type: 'string', enum: ['g', 'pg', 'pg13', 'r17', 'r', 'rx', 'r18'] } },
          { name: 'genres', in: 'query', required: false, schema: { type: 'string', pattern: '^[a-z0-9-]+(,[a-z0-9-]+)*$' }, example: 'action,adventure' },
          { name: 'order_by', in: 'query', required: false, schema: { type: 'string', enum: ['mal_id', 'title', 'start_date', 'end_date', 'episodes', 'score', 'scored_by', 'rank', 'popularity', 'members', 'favorites'] } },
          { name: 'sort', in: 'query', required: false, schema: { type: 'string', enum: ['asc', 'desc'] } },
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
          429: { description: 'Rate limit de Kitsu', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          503: { description: 'Fallo temporal de API externa', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/anime/genres': {
      get: {
        tags: ['Anime'],
        summary: 'Lista generos publicos para filtros de catalogo',
        responses: {
          200: { description: 'Generos de anime', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/AnimeGenre' } } } } } } },
          429: { description: 'Rate limit de Kitsu', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          503: { description: 'Fallo temporal de API externa', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/anime/{source}/{externalId}': {
      get: {
        tags: ['Anime'],
        summary: 'Obtiene el detalle publico de un anime desde Kitsu',
        parameters: [
          {
            name: 'source',
            in: 'path',
            required: true,
            schema: { type: 'string', enum: ['KITSU'] },
          },
          {
            name: 'externalId',
            in: 'path',
            required: true,
            schema: { type: 'string', pattern: '^[1-9]\\d*$' },
            example: '7442',
          },
        ],
        responses: {
          200: { description: 'Detalle normalizado', content: { 'application/json': { schema: { type: 'object', properties: { data: { $ref: '#/components/schemas/AnimeDetail' } } } } } },
          400: { description: 'Datos invalidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'Anime no encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          429: { description: 'Rate limit de Kitsu', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          503: { description: 'Fallo temporal de API externa', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
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
                            recommendations: { type: 'array', items: { $ref: '#/components/schemas/HomeAnimeItem' } },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          429: { description: 'Rate limit de Kitsu', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          503: { description: 'Fallo temporal de API externa', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/home/featured': {
      get: { tags: ['Home'], summary: 'Animes destacados para hero/carrusel', responses: { 200: { description: 'Lista destacada', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/HomeAnimeItem' } } } } } } }, 429: { description: 'Rate limit de Kitsu', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 503: { description: 'Fallo temporal de API externa', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } } },
    },
    '/api/home/top-airing': {
      get: { tags: ['Home'], summary: 'Top animes en emision', responses: { 200: { description: 'Top airing', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/HomeAnimeItem' } } } } } } }, 429: { description: 'Rate limit de Kitsu', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 503: { description: 'Fallo temporal de API externa', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } } },
    },
    '/api/home/seasonal': {
      get: { tags: ['Home'], summary: 'Animes de temporada actual', responses: { 200: { description: 'Temporada actual', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/HomeAnimeItem' } } } } } } }, 429: { description: 'Rate limit de Kitsu', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 503: { description: 'Fallo temporal de API externa', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } } },
    },
    '/api/home/upcoming': {
      get: { tags: ['Home'], summary: 'Proximos estrenos', responses: { 200: { description: 'Proximos estrenos', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/HomeAnimeItem' } } } } } } }, 429: { description: 'Rate limit de Kitsu', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 503: { description: 'Fallo temporal de API externa', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } } },
    },
    '/api/home/popular': {
      get: { tags: ['Home'], summary: 'Animes populares', responses: { 200: { description: 'Populares', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/HomeAnimeItem' } } } } } } }, 429: { description: 'Rate limit de Kitsu', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 503: { description: 'Fallo temporal de API externa', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } } },
    },
    '/api/home/recommendations': {
      get: { tags: ['Home'], summary: 'Recomendaciones basadas en animes populares', responses: { 200: { description: 'Recomendaciones', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/HomeAnimeItem' } } } } } } }, 429: { description: 'Rate limit de Kitsu', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }, 503: { description: 'Fallo temporal de API externa', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } } } },
    },
    '/api/library': {
      get: {
        tags: ['Library'],
        summary: 'Lista la biblioteca del usuario autenticado',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'status', in: 'query', required: false, schema: { type: 'string', enum: ['WATCHING', 'COMPLETED', 'ON_HOLD', 'DROPPED', 'PLAN_TO_WATCH'] } },
          { name: 'page', in: 'query', required: false, schema: { type: 'integer', minimum: 1, default: 1 } },
          { name: 'limit', in: 'query', required: false, schema: { type: 'integer', minimum: 1, maximum: 50, default: 20 } },
        ],
        responses: {
          200: {
            description: 'Biblioteca paginada',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'array', items: { $ref: '#/components/schemas/LibraryEntry' } },
                    pagination: {
                      type: 'object',
                      properties: {
                        page: { type: 'number', example: 1 },
                        limit: { type: 'number', example: 20 },
                        total: { type: 'number', example: 1 },
                        totalPages: { type: 'number', example: 1 },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: 'Datos invalidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          401: { description: 'Token ausente o invalido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
      post: {
        tags: ['Library'],
        summary: 'Agrega un anime a la biblioteca personal',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['source', 'externalId'],
                properties: {
                  source: { type: 'string', enum: ['KITSU'], example: 'KITSU' },
                  externalId: { type: 'string', pattern: '^[1-9]\\d*$', example: '7442' },
                  status: { type: 'string', enum: ['WATCHING', 'COMPLETED', 'ON_HOLD', 'DROPPED', 'PLAN_TO_WATCH'], default: 'PLAN_TO_WATCH' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Anime agregado a biblioteca', content: { 'application/json': { schema: { type: 'object', properties: { data: { $ref: '#/components/schemas/LibraryEntry' } } } } } },
          400: { description: 'Datos invalidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          401: { description: 'Token ausente o invalido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          409: { description: 'Anime duplicado en biblioteca', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          503: { description: 'Fallo temporal de API externa al persistir anime', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/library/{id}': {
      patch: {
        tags: ['Library'],
        summary: 'Actualiza un registro de biblioteca',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', enum: ['WATCHING', 'COMPLETED', 'ON_HOLD', 'DROPPED', 'PLAN_TO_WATCH'] },
                  episodesWatched: { type: 'number', minimum: 0, example: 4 },
                  personalScore: { type: 'number', nullable: true, minimum: 1, maximum: 10, example: 8 },
                  notes: { type: 'string', nullable: true, maxLength: 1000, example: 'Watching weekly.' },
                  startedAt: { type: 'string', format: 'date-time', nullable: true },
                  finishedAt: { type: 'string', format: 'date-time', nullable: true },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Registro actualizado', content: { 'application/json': { schema: { type: 'object', properties: { data: { $ref: '#/components/schemas/LibraryEntry' } } } } } },
          400: { description: 'Datos invalidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          401: { description: 'Token ausente o invalido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'Registro no encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          422: { description: 'Reglas de negocio incumplidas', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
      delete: {
        tags: ['Library'],
        summary: 'Elimina un registro de biblioteca',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          204: { description: 'Registro eliminado' },
          401: { description: 'Token ausente o invalido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'Registro no encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/favorites': {
      get: {
        tags: ['Favorites'],
        summary: 'Lista favoritos del usuario autenticado',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Favoritos del usuario', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/FavoriteEntry' } } } } } } },
          401: { description: 'Token ausente o invalido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
      post: {
        tags: ['Favorites'],
        summary: 'Marca un anime como favorito',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['source', 'externalId'],
                properties: {
                  source: { type: 'string', enum: ['KITSU'], example: 'KITSU' },
                  externalId: { type: 'string', pattern: '^[1-9]\\d*$', example: '7442' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Favorito creado', content: { 'application/json': { schema: { type: 'object', properties: { data: { $ref: '#/components/schemas/FavoriteEntry' } } } } } },
          400: { description: 'Datos invalidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          401: { description: 'Token ausente o invalido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          409: { description: 'Favorito duplicado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          503: { description: 'Fallo temporal de API externa al persistir anime', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/favorites/{id}': {
      delete: {
        tags: ['Favorites'],
        summary: 'Quita un anime de favoritos',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          204: { description: 'Favorito eliminado' },
          401: { description: 'Token ausente o invalido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'Favorito no encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/statistics/me': {
      get: {
        tags: ['Statistics'],
        summary: 'Obtiene estadisticas del usuario autenticado',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Estadisticas personales', content: { 'application/json': { schema: { type: 'object', properties: { data: { $ref: '#/components/schemas/StatisticsSummary' } } } } } },
          401: { description: 'Token ausente o invalido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/statistics/users/{username}': {
      get: {
        tags: ['Statistics'],
        summary: 'Obtiene estadisticas publicas de un usuario',
        parameters: [{ name: 'username', in: 'path', required: true, schema: { type: 'string', minLength: 3, maxLength: 30 } }],
        responses: {
          200: { description: 'Estadisticas publicas', content: { 'application/json': { schema: { type: 'object', properties: { data: { $ref: '#/components/schemas/PublicStatisticsSummary' } } } } } },
          400: { description: 'Datos invalidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'Usuario no encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
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
