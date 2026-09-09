import { and, eq, ilike } from 'drizzle-orm';

import { getDb } from '~db';
import { mealPool } from '~db/schema';
import { type MealPool } from '~types/meal-pool';

export const fetchMealPool = async ({
    q,
    userId,
}: {
    q: string;
    userId: number;
}): Promise<Pick<MealPool, 'content'>[]> =>
    getDb()
        .select({ content: mealPool.content })
        .from(mealPool)
        .where(
            and(
                eq(mealPool.user_id, userId),
                ilike(mealPool.content, `%${q}%`),
            ),
        )
        .limit(10);

export const createMealInPool = async ({
    content,
    userId,
}: {
    content: string[];
    userId: number;
}) => {
    if (content.length)
        await getDb()
            .insert(mealPool)
            .values(content.map((item) => ({ content: item, user_id: userId })))
            .onConflictDoNothing();
    return { error: null };
};
