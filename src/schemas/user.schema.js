const { z } = require('zod');

const nullableUrlSchema = z
  .union([z.string().trim().url().max(2048), z.literal(''), z.null()])
  .optional()
  .transform((value) => (value === '' ? null : value));

const updateMeSchema = z
  .object({
    body: z
      .object({
        username: z.string().trim().min(3).max(30).optional(),
        avatarUrl: nullableUrlSchema,
        bannerUrl: nullableUrlSchema,
        bio: z
          .union([z.string().trim().max(500), z.null()])
          .optional()
          .transform((value) => (value === '' ? null : value)),
      })
      .strict(),
  })
  .refine((data) => Object.keys(data.body).length > 0, {
    path: ['body'],
    message: 'At least one field is required',
  });

module.exports = { updateMeSchema };
