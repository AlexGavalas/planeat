import { and, asc, eq, ilike, inArray } from 'drizzle-orm';
import 'server-only';

import { getDb } from '~db';
import { mealPool, mealPoolItems } from '~db/schema';
import { type EditedMealItem } from '~types/meal';
import { type MealTemplate } from '~types/meal-pool';

export const fetchMealPool = async ({
    q,
    userId,
}: {
    q: string;
    userId: number;
}): Promise<MealTemplate[]> => {
    const db = getDb();
    const rows = await db
        .select({ content: mealPool.content, id: mealPool.id })
        .from(mealPool)
        .where(
            and(
                eq(mealPool.user_id, userId),
                ilike(mealPool.content, `%${q}%`),
            ),
        )
        .limit(10);
    const ids = rows.map(({ id }) => id);
    const items = ids.length
        ? await db
              .select()
              .from(mealPoolItems)
              .where(inArray(mealPoolItems.meal_pool_id, ids))
              .orderBy(asc(mealPoolItems.position))
        : [];
    return rows.map((template) => ({
        ...template,
        items: items
            .filter((item) => item.meal_pool_id === template.id)
            .map(({ meal_pool_id: _templateId, ...item }) => item),
    }));
};

export const saveMealTemplates = async ({
    templates,
    userId,
}: {
    templates: { content: string; id?: number; items: EditedMealItem[] }[];
    userId: number;
}): Promise<{ error: null }> => {
    await getDb().transaction(async (db) => {
        for (const template of templates) {
            const [saved] = template.id
                ? await db
                      .update(mealPool)
                      .set({ content: template.content })
                      .where(
                          and(
                              eq(mealPool.id, template.id),
                              eq(mealPool.user_id, userId),
                          ),
                      )
                      .returning({ id: mealPool.id })
                : await db
                      .insert(mealPool)
                      .values({ content: template.content, user_id: userId })
                      .onConflictDoUpdate({
                          set: { content: template.content },
                          target: [mealPool.user_id, mealPool.content],
                      })
                      .returning({ id: mealPool.id });
            if (!saved) {
                throw new Error('Meal template not found');
            }
            await db
                .delete(mealPoolItems)
                .where(eq(mealPoolItems.meal_pool_id, saved.id));
            if (template.items.length) {
                await db.insert(mealPoolItems).values(
                    template.items.map((item) => ({
                        alternative_name: item.alternative_name ?? null,
                        basis_grams: item.basis_grams,
                        brand: item.brand ?? null,
                        calories: item.calories ?? null,
                        carbohydrates: item.carbohydrates ?? null,
                        fat: item.fat ?? null,
                        fiber: item.fiber ?? null,
                        meal_pool_id: saved.id,
                        name: item.name,
                        position: item.position,
                        protein: item.protein ?? null,
                        provider_food_id: item.provider_food_id,
                        quantity_grams: item.quantity_grams,
                        salt: item.salt ?? null,
                        source: item.source,
                        sugar: item.sugar ?? null,
                    })),
                );
            }
        }
    });

    return { error: null };
};
