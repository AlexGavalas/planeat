import { z } from 'zod';

export const foodSearchQuerySchema = z.object({
    country: z.enum(['all', 'de', 'gr']).default('de'),
    q: z.string().trim().min(2).max(100),
});
