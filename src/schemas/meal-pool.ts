import { z } from 'zod';

import { type EditedMealPool } from '~types/meal-pool';

type MealPoolSchema = z.ZodType<EditedMealPool>;

export const mealPoolSchema: MealPoolSchema = z.object({
    content: z.string(),
    id: z.number(),
    user_id: z.number(),
});

export const postRequestSchema = z.object({
    content: z.array(z.string()),
});
