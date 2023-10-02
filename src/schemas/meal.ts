import { z } from 'zod';

import { type EditedMeal } from '~types/meal';

type MealSchema = z.ZodType<EditedMeal>;

export const mealSchema: MealSchema = z.object({
    day: z.string(),
    id: z.string().optional(),
    meal: z.string(),
    note: z.string().nullable().optional(),
    rating: z.number().nullable().optional(),
    section_key: z.string(),
    user_id: z.number(),
});

export const getResponseSchema = z.object({
    data: z.array(mealSchema).nullable(),
});

export const patchRequestSchema = z.object({
    deletedIds: z.string().array(),
    editedMeals: z.array(mealSchema),
    newMeals: z.array(mealSchema),
});
