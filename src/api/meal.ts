import { and, eq, gte, inArray, lte } from 'drizzle-orm';
import 'server-only';

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

export const fetchMealsForDay = async ({
    day,
    userId,
}: {
    day: string;
    userId: number;
}): Promise<Meal[]> =>
    getDb()
        .select()
        .from(meals)
        .where(and(eq(meals.user_id, userId), eq(meals.day, day)));

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
    editedMeals,
    userId,
    db = getDb(),
}: {
    db?: ReturnType<typeof getDb>;
    editedMeals: EditedMeal[];
    userId: number;
}): Promise<{ error: null }> => {
    await db.transaction(async (tx) => {
        for (const meal of editedMeals) {
            if (!meal.id) {
                throw new Error('Edited meals must have an id');
            }

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
    db = getDb(),
}: {
    db?: ReturnType<typeof getDb>;
    newMeals: EditedMeal[];
    userId: number;
}): Promise<{ error: null }> => {
    if (newMeals.length) {
        await db.insert(meals).values(
            newMeals.map((meal) => ({
                ...meal,
                id: undefined,
                user_id: userId,
            })),
        );
    }

    return { error: null };
};

export const saveMeals = async (input: {
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
