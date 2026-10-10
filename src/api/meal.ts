import { and, asc, eq, gte, inArray, lte } from 'drizzle-orm';
import 'server-only';

import { getDb } from '~db';
import { mealItems, meals } from '~db/schema';
import { type EditedMeal, type EditedMealItem, type Meal } from '~types/meal';

const itemValues = (
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

export const fetchMeals = async ({
    endDate,
    startDate,
    userId,
}: {
    endDate: string;
    startDate: string;
    userId: number;
}): Promise<{ data: Meal[] }> => {
    const db = getDb();
    const rows = await db
        .select()
        .from(meals)
        .where(
            and(
                eq(meals.user_id, userId),
                gte(meals.day, startDate),
                lte(meals.day, endDate),
            ),
        );
    const ids = rows.map(({ id }) => id);
    const items = ids.length
        ? await db
              .select()
              .from(mealItems)
              .where(inArray(mealItems.meal_id, ids))
              .orderBy(asc(mealItems.position))
        : [];
    return {
        data: rows.map((meal) => ({
            ...meal,
            items: items
                .filter((item) => item.meal_id === meal.id)
                .map(({ meal_id: _mealId, ...item }) => item),
        })),
    };
};

export const fetchMealsForDay = async ({
    day,
    userId,
}: {
    day: string;
    userId: number;
}): Promise<Meal[]> => {
    const { data } = await fetchMeals({ endDate: day, startDate: day, userId });
    return data;
};

export const deleteMeals = async ({
    deletedIds,
    userId,
    db = getDb(),
}: {
    db?: ReturnType<typeof getDb>;
    deletedIds: string[];
    userId: number;
}): Promise<{ error: null }> => {
    if (deletedIds.length) {
        await db
            .delete(meals)
            .where(
                and(inArray(meals.id, deletedIds), eq(meals.user_id, userId)),
            );
    }

    return { error: null };
};

export const updateMeals = async ({
    allowAnnotations = true,
    editedMeals,
    userId,
    db = getDb(),
}: {
    allowAnnotations?: boolean;
    db?: ReturnType<typeof getDb>;
    editedMeals: EditedMeal[];
    userId: number;
}): Promise<{ error: null }> => {
    await db.transaction(async (tx) => {
        for (const meal of editedMeals) {
            if (!meal.id) {
                throw new Error('Edited meals must have an id');
            }
            const mealId = meal.id;

            const [updated] = await tx
                .update(meals)
                .set({
                    day: meal.day,
                    meal: meal.meal,
                    ...(allowAnnotations && {
                        note: meal.note,
                        rating: meal.rating,
                    }),
                    section_key: meal.section_key,
                })
                .where(and(eq(meals.id, mealId), eq(meals.user_id, userId)))
                .returning({ id: meals.id });

            if (updated && meal.items) {
                await tx.delete(mealItems).where(eq(mealItems.meal_id, mealId));
                if (meal.items.length) {
                    await tx
                        .insert(mealItems)
                        .values(
                            meal.items.map((item) => itemValues(mealId, item)),
                        );
                }
            }
        }
    });

    return { error: null };
};

export const createMeals = async ({
    allowAnnotations = true,
    newMeals,
    userId,
    db = getDb(),
}: {
    allowAnnotations?: boolean;
    db?: ReturnType<typeof getDb>;
    newMeals: EditedMeal[];
    userId: number;
}): Promise<{ error: null }> => {
    if (newMeals.length) {
        for (const meal of newMeals) {
            const [created] = await db
                .insert(meals)
                .values({
                    day: meal.day,
                    meal: meal.meal,
                    ...(!allowAnnotations && { note: null, rating: null }),
                    note: allowAnnotations ? meal.note : null,
                    rating: allowAnnotations ? meal.rating : null,
                    section_key: meal.section_key,
                    user_id: userId,
                })
                .returning({ id: meals.id });
            if (created && meal.items?.length) {
                await db
                    .insert(mealItems)
                    .values(
                        meal.items.map((item) => itemValues(created.id, item)),
                    );
            }
        }
    }

    return { error: null };
};

export const saveMeals = async (input: {
    allowAnnotations?: boolean;
    deletedIds: string[];
    editedMeals: EditedMeal[];
    newMeals: EditedMeal[];
    userId: number;
}): Promise<void> => {
    await getDb().transaction(async (db) => {
        await deleteMeals({ ...input, db });
        await updateMeals({ ...input, db });
        await createMeals({ ...input, db });
    });
};
