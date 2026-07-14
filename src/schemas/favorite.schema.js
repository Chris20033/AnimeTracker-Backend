const { z } = require('zod');

const addFavoriteSchema = z.object({
  body: z.object({
    source: z.enum(['KITSU']),
    externalId: z.string().regex(/^[1-9]\d*$/, 'externalId must be a positive numeric string'),
  }),
});

const deleteFavoriteSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

module.exports = { addFavoriteSchema, deleteFavoriteSchema };
