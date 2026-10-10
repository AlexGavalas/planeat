import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';

import type { mealItems, meals } from '~db/schema';

export type MealItem = Omit<InferSelectModel<typeof mealItems>, 'meal_id'>;
export type EditedMealItem = Omit<
    InferInsertModel<typeof mealItems>,
    'id' | 'meal_id'
> & { id?: string };
export type Meal = InferSelectModel<typeof meals> & { items?: MealItem[] };
export type EditedMeal = InferInsertModel<typeof meals> & {
    items?: EditedMealItem[];
};
export type MealChange = Partial<Omit<Meal, 'items'>> & {
    items?: EditedMealItem[];
};

export type MealsMap = Record<string, Meal | EditedMeal>;
