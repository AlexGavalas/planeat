import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';

import { meals } from '~db/schema';

export type Meal = InferSelectModel<typeof meals>;
export type EditedMeal = InferInsertModel<typeof meals>;

export type MealsMap = Record<string, Meal | EditedMeal>;
