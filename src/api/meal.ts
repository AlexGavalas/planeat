import { and, eq, gte, inArray, lte } from 'drizzle-orm';

import { getDb } from '~db';
import { meals } from '~db/schema';
import { type EditedMeal, type Meal } from '~types/meal';

export const fetchMeals = async ({
    endDate,
    startDate,
    userId,
}: {
    endDate: string;
    startDate: string;
    userId: number;
}): Promise<{ data: Meal[] }> => ({
    data: await getDb()
        .select()
        .from(meals)
        .where(
            and(
                eq(meals.user_id, userId),
                gte(meals.day, startDate),
                lte(meals.day, endDate),
            ),
        ),
});

export const deleteMeals = async ({
    deletedIds,
    userId,
}: {
    deletedIds: string[];
    userId: number;
}) => {
    if (deletedIds.length)
        await getDb()
            .delete(meals)
            .where(
                and(inArray(meals.id, deletedIds), eq(meals.user_id, userId)),
            );
    return { error: null };
};

export const updateMeals = async ({
    editedMeals,
    userId,
}: {
    editedMeals: EditedMeal[];
    userId: number;
}) => {
    const db = getDb();
    await db.transaction(async (tx) => {
        for (const meal of editedMeals) {
            if (!meal.id) throw new Error('Edited meals must have an id');
            await tx
                .update(meals)
                .set({
                    day: meal.day,
                    meal: meal.meal,
                    note: meal.note,
                    rating: meal.rating,
                    section_key: meal.section_key,
                })
                .where(and(eq(meals.id, meal.id), eq(meals.user_id, userId)));
        }
    });
    return { error: null };
};

export const createMeals = async ({
    newMeals,
    userId,
}: {
    newMeals: EditedMeal[];
    userId: number;
}) => {
    if (newMeals.length)
        await getDb()
            .insert(meals)
            .values(
                newMeals.map((meal) => ({
                    ...meal,
                    user_id: userId,
                    id: undefined,
                })),
            );
    return { error: null };
};
