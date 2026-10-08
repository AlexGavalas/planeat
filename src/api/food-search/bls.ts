import 'server-only';

import { type FoodNutrition, type FoodSearchResult } from '~types/food-search';

import blsData from '../../data/bls-foods.json';

const RESULT_LIMIT = 8;

type BlsFood = {
    calories: number | null;
    carbohydrates: number | null;
    englishName: string;
    fat: number | null;
    fiber: number | null;
    id: string;
    name: string;
    protein: number | null;
    salt: number | null;
    sugar: number | null;
};

const blsFoods = blsData.foods as BlsFood[];
const normalize = (value: string): string =>
    value
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('de-DE');
const nutritionFromBls = (food: BlsFood): FoodNutrition => ({
    calories: food.calories,
    carbohydrates: food.carbohydrates,
    fat: food.fat,
    fiber: food.fiber,
    protein: food.protein,
    salt: food.salt,
    sugar: food.sugar,
});

const scoreBlsFood = (food: BlsFood, query: string): number => {
    const names = [normalize(food.name), normalize(food.englishName)];
    if (names.includes(query)) {
        return 0;
    }
    if (names.some((name) => name.startsWith(query))) {
        return 1;
    }
    if (
        names.some((name) =>
            name.split(/\s+/).some((word) => word.startsWith(query)),
        )
    ) {
        return 2;
    }
    if (names.some((name) => name.includes(query))) {
        return 3;
    }
    return Number.POSITIVE_INFINITY;
};

export const searchBlsFoods = (query: string): FoodSearchResult[] => {
    const normalizedQuery = normalize(query.trim());
    return blsFoods
        .map((food) => ({ food, score: scoreBlsFood(food, normalizedQuery) }))
        .filter(({ score }) => Number.isFinite(score))
        .sort(
            (a, b) =>
                a.score - b.score ||
                a.food.name.localeCompare(b.food.name, 'de'),
        )
        .slice(0, RESULT_LIMIT)
        .map(({ food }) => ({
            alternativeName: food.englishName,
            brand: null,
            id: food.id,
            name: food.name,
            nutrition: nutritionFromBls(food),
            quantity: null,
            source: 'bls',
        }));
};
