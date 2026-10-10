import { mealItemSchema, patchRequestSchema } from './meal';

const item = {
    alternative_name: null,
    basis_grams: 100,
    brand: null,
    calories: 400,
    carbohydrates: 60,
    fat: 10,
    fiber: 8,
    name: 'Oats',
    position: 0,
    protein: 20,
    provider_food_id: 'C133000',
    quantity_grams: 80,
    salt: 0,
    source: 'bls' as const,
    sugar: 1,
};

describe('structured meal schemas', () => {
    it('accepts food snapshots in a meal-plan change', () => {
        expect(
            patchRequestSchema.parse({
                deletedIds: [],
                editedMeals: [],
                newMeals: [
                    {
                        day: '2026-10-10',
                        items: [item],
                        meal: 'Porridge',
                        section_key: 'morning_Sat 10/10/2026',
                        user_id: 7,
                    },
                ],
            }),
        ).toMatchObject({ newMeals: [{ items: [item] }] });
    });

    it('rejects non-positive quantities', () => {
        expect(
            mealItemSchema.safeParse({ ...item, quantity_grams: 0 }).success,
        ).toBe(false);
    });
});
