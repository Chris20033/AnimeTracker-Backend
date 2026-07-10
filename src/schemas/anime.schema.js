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
    status: z.enum(['airing', 'complete', 'upcoming']).optional(),
    rating: z.enum(['g', 'pg', 'pg13', 'r17', 'r', 'rx']).optional(),
    genres: z.string().regex(/^\d+(,\d+)*$/, 'genres must be a comma-separated numeric list').optional(),
    genres_exclude: z.string().regex(/^\d+(,\d+)*$/, 'genres_exclude must be a comma-separated numeric list').optional(),
    order_by: z.enum(['mal_id', 'title', 'type', 'rating', 'start_date', 'end_date', 'episodes', 'score', 'scored_by', 'rank', 'popularity', 'members', 'favorites']).default('popularity'),
    sort: z.enum(['asc', 'desc']).default('asc'),
    min_score: z.coerce.number().min(0).max(10).optional(),
    max_score: z.coerce.number().min(0).max(10).optional(),
    start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'start_date must use YYYY-MM-DD format').optional(),
    end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'end_date must use YYYY-MM-DD format').optional(),
  }).refine((query) => {
    if (query.min_score === undefined || query.max_score === undefined) {
      return true;
    }

    return query.min_score <= query.max_score;
  }, {
    path: ['min_score'],
    message: 'min_score must be less than or equal to max_score',
  }),
});

const animeDetailSchema = z.object({
  params: z.object({
    source: z.enum(['JIKAN']),
    externalId: z.string().regex(/^[1-9]\d*$/, 'externalId must be a positive numeric string'),
  }),
});

module.exports = { searchAnimeSchema, catalogAnimeSchema, animeDetailSchema };
