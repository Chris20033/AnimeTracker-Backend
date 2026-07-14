const { z } = require('zod');

const publicStatisticsSchema = z.object({
  params: z.object({
    username: z.string().trim().min(3).max(30),
  }),
});

module.exports = { publicStatisticsSchema };
