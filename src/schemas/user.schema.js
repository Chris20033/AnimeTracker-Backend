const { z } = require('zod');

const updateMeSchema = z
  .object({
    files: z.any().optional(),
    body: z
      .object({
        username: z.string().trim().min(3).max(30).optional(),
        avatar: z.any().optional(),
        banner: z.any().optional(),
        bio: z
          .union([z.string().trim().max(500), z.null()])
          .optional()
          .transform((value) => (value === '' ? null : value)),
      })
      .strict(),
  })
  .refine((data) => Object.keys(data.body).length > 0 || Boolean(data.files?.avatar?.length) || Boolean(data.files?.banner?.length), {
    path: ['body'],
    message: 'At least one field is required',
  });

module.exports = { updateMeSchema };
