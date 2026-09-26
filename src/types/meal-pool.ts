import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';

import type { mealPool } from '~db/schema';

export type MealPool = InferSelectModel<typeof mealPool>;
export type EditedMealPool = InferInsertModel<typeof mealPool>;
