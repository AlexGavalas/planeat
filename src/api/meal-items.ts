import type { mealItems } from '~db/schema';
import { type EditedMealItem } from '~types/meal';

export const itemValues = (
    mealId: string,
    item: EditedMealItem,
): typeof mealItems.$inferInsert => ({
    alternative_name: item.alternative_name ?? null,
    basis_grams: item.basis_grams,
    brand: item.brand ?? null,
    calories: item.calories ?? null,
    carbohydrates: item.carbohydrates ?? null,
    fat: item.fat ?? null,
    fiber: item.fiber ?? null,
    meal_id: mealId,
    name: item.name,
    position: item.position,
    protein: item.protein ?? null,
    provider_food_id: item.provider_food_id,
    quantity_grams: item.quantity_grams,
    salt: item.salt ?? null,
    source: item.source,
    sugar: item.sugar ?? null,
});
