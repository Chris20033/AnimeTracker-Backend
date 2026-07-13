const { z } = require('zod');

const pageSchema = z.coerce.number().int().min(1).default(1);
const limitSchema = z.coerce.number().int().min(1).max(25).default(20);
const catalogLimitSchema = z.coerce.number().int().min(1).max(25).default(24);

const searchAnimeSchema = z.object({
  query: z.object({
    q: z.string().trim().min(1).max(100),
    page: pageSchema,
    limit: limitSchema,
  }),
});

const catalogAnimeSchema = z.object({
  query: z.object({
    page: pageSchema,
    limit: catalogLimitSchema,
    q: z.string().trim().min(1).max(100).optional(),
    type: z.enum(['tv', 'movie', 'ova', 'special', 'ona', 'music', 'cm', 'pv', 'tv_special']).optional(),
    status: z.enum(['airing', 'current', 'complete', 'finished', 'upcoming']).optional(),
    rating: z.enum(['g', 'pg', 'pg13', 'r17', 'r', 'rx', 'r18']).optional(),
    genres: z.string().regex(/^[a-z0-9-]+(,[a-z0-9-]+)*$/, 'genres must be a comma-separated category slug list').optional(),
    order_by: z.enum(['mal_id', 'title', 'start_date', 'end_date', 'episodes', 'score', 'scored_by', 'rank', 'popularity', 'members', 'favorites']).optional(),
    sort: z.enum(['asc', 'desc']).optional(),
  }),
});

const animeDetailSchema = z.object({
  params: z.object({
    source: z.enum(['KITSU']),
    externalId: z.string().regex(/^[1-9]\d*$/, 'externalId must be a positive numeric string'),
  }),
});

module.exports = { searchAnimeSchema, catalogAnimeSchema, animeDetailSchema };
