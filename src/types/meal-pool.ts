import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';

import { mealPool } from '~db/schema';

export type MealPool = InferSelectModel<typeof mealPool>;
export type EditedMealPool = InferInsertModel<typeof mealPool>;
