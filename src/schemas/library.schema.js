const { z } = require('zod');

const libraryStatuses = ['WATCHING', 'COMPLETED', 'ON_HOLD', 'DROPPED', 'PLAN_TO_WATCH'];
const dateSchema = z.coerce.date();

const getLibrarySchema = z.object({
  query: z.object({
    status: z.enum(libraryStatuses).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
  }),
});

const addLibrarySchema = z.object({
  body: z.object({
    source: z.enum(['KITSU']),
    externalId: z.string().regex(/^[1-9]\d*$/, 'externalId must be a positive numeric string'),
    status: z.enum(libraryStatuses).default('PLAN_TO_WATCH'),
  }),
});

const updateLibrarySchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    status: z.enum(libraryStatuses).optional(),
    episodesWatched: z.coerce.number().int().min(0).optional(),
    personalScore: z.coerce.number().int().min(1).max(10).nullable().optional(),
    notes: z.string().trim().max(1000).nullable().optional(),
    startedAt: dateSchema.nullable().optional(),
    finishedAt: dateSchema.nullable().optional(),
  }).refine((body) => Object.keys(body).length > 0, {
    message: 'At least one field must be provided',
  }),
});

const deleteLibrarySchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

module.exports = { getLibrarySchema, addLibrarySchema, updateLibrarySchema, deleteLibrarySchema, libraryStatuses };
