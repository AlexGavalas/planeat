import { z } from 'zod';

import { type EditedMeal } from '~types/meal';

type MealSchema = z.ZodType<EditedMeal>;

export const mealItemSchema = z.object({
    alternative_name: z.string().nullable().optional(),
    basis_grams: z.number().positive(),
    brand: z.string().nullable().optional(),
    calories: z.number().finite().nullable().optional(),
    carbohydrates: z.number().finite().nullable().optional(),
    fat: z.number().finite().nullable().optional(),
    fiber: z.number().finite().nullable().optional(),
    id: z.string().uuid().optional(),
    name: z.string().min(1),
    position: z.number().int().nonnegative(),
    protein: z.number().finite().nullable().optional(),
    provider_food_id: z.string().min(1),
    quantity_grams: z.number().positive(),
    salt: z.number().finite().nullable().optional(),
    source: z.enum(['bls', 'open-food-facts']),
    sugar: z.number().finite().nullable().optional(),
});

export const mealSchema: MealSchema = z.object({
    day: z.string(),
    id: z.string().optional(),
    items: z.array(mealItemSchema).optional(),
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
