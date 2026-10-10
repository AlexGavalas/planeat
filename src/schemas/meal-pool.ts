import { z } from 'zod';

import { type EditedMealPool } from '~types/meal-pool';

import { mealItemSchema } from './meal';

type MealPoolSchema = z.ZodType<EditedMealPool>;

export const mealPoolSchema: MealPoolSchema = z.object({
    content: z.string(),
    id: z.number(),
    items: z.array(mealItemSchema).optional(),
    user_id: z.number(),
});

export const postRequestSchema = z.object({
    templates: z.array(
        z.object({
            content: z.string().min(1),
            id: z.number().int().positive().optional(),
            items: z.array(mealItemSchema),
        }),
    ),
});
