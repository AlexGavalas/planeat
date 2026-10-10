import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';

import type { mealPool } from '~db/schema';

import { type EditedMealItem, type MealItem } from './meal';

export type MealPool = InferSelectModel<typeof mealPool> & {
    items: MealItem[];
};
export type EditedMealPool = InferInsertModel<typeof mealPool> & {
    items?: EditedMealItem[];
};

export type MealTemplate = Pick<MealPool, 'content' | 'id'> & {
    items: MealItem[];
};
