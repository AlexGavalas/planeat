import {
    foodToMealItem,
    macroEnergyPercentages,
    scaleNutrition,
    totalNutrition,
} from './nutrition';

const oats = foodToMealItem(
    {
        alternativeName: null,
        brand: null,
        id: 'oats',
        name: 'Oats',
        nutrition: {
            calories: 400,
            carbohydrates: 60,
            fat: 10,
            fiber: 8,
            protein: 20,
            salt: 0,
            sugar: null,
        },
        quantity: null,
        source: 'bls',
    },
    0,
);

describe('nutrition calculations', () => {
    it('scales per-100g snapshots using the configured gram quantity', () => {
        expect(scaleNutrition({ ...oats, quantity_grams: 50 })).toMatchObject({
            calories: 200,
            carbohydrates: 30,
            fat: 5,
            protein: 10,
        });
    });

    it('returns known subtotals while marking missing nutrient data incomplete', () => {
        const totals = totalNutrition([
            { ...oats, quantity_grams: 50 },
            { ...oats, calories: null, quantity_grams: 25 },
        ]);

        expect(totals).toMatchObject({
            calories: 200,
            complete: { calories: false, protein: true, sugar: false },
            protein: 15,
            sugar: null,
        });
    });

    it('calculates macro energy percentages independently from provider calories', () => {
        expect(
            macroEnergyPercentages({
                calories: 999,
                carbohydrates: 10,
                fat: 10,
                fiber: null,
                protein: 10,
                salt: null,
                sugar: null,
            }),
        ).toStrictEqual({
            carbohydrates: (40 / 170) * 100,
            fat: (90 / 170) * 100,
            protein: (40 / 170) * 100,
        });
    });
});
