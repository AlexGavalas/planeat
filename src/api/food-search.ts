import 'server-only';
import { z } from 'zod';

import {
    type FoodNutrition,
    type FoodSearchCountry,
    type FoodSearchResponse,
    type FoodSearchResult,
} from '~types/food-search';

import blsData from '../data/bls-foods.json';

const RESULT_LIMIT = 8;
const OPEN_FOOD_FACTS_URL = 'https://search.openfoodfacts.org/search';
const OPEN_FOOD_FACTS_USER_AGENT =
    'Planeat/0.0.1 (https://github.com/AlexGavalas/planeat)';

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

const nullableNumber = z.number().finite().nullable().optional();
const openFoodFactsResponseSchema = z.object({
    hits: z.array(
        z.object({
            brands: z.array(z.string()).optional(),
            code: z.string(),
            nutriments: z
                .object({
                    carbohydrates_100g: nullableNumber,
                    'energy-kcal_100g': nullableNumber,
                    fat_100g: nullableNumber,
                    fiber_100g: nullableNumber,
                    proteins_100g: nullableNumber,
                    salt_100g: nullableNumber,
                    sugars_100g: nullableNumber,
                })
                .optional(),
            product_name: z.string().optional(),
            product_name_de: z.string().optional(),
            product_name_el: z.string().optional(),
            quantity: z.string().optional(),
        }),
    ),
});

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

const countryTags: Record<Exclude<FoodSearchCountry, 'all'>, string> = {
    de: 'en:germany',
    gr: 'en:greece',
};

const sanitizeOpenFoodFactsQuery = (query: string): string =>
    query
        .replace(/[+\-=&|><!(){}[\]^"~*?:\\/]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

export const searchOpenFoodFacts = async ({
    country,
    query,
}: {
    country: FoodSearchCountry;
    query: string;
}): Promise<FoodSearchResult[]> => {
    const safeQuery = sanitizeOpenFoodFactsQuery(query);
    const filteredQuery =
        country === 'all'
            ? safeQuery
            : `${safeQuery} countries_tags:"${countryTags[country]}"`;
    const languages = country === 'gr' ? ['el', 'en'] : ['de', 'en'];

    const response = await fetch(OPEN_FOOD_FACTS_URL, {
        body: JSON.stringify({
            fields: [
                'code',
                'product_name',
                'product_name_de',
                'product_name_el',
                'brands',
                'quantity',
                'nutriments',
            ],
            langs: languages,
            page_size: RESULT_LIMIT,
            q: filteredQuery,
        }),
        cache: 'force-cache',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': OPEN_FOOD_FACTS_USER_AGENT,
        },
        method: 'POST',
        next: { revalidate: 60 * 60 * 24 },
        signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
        throw new Error(`Open Food Facts responded with ${response.status}`);
    }

    const parsed = openFoodFactsResponseSchema.parse(await response.json());

    return parsed.hits.flatMap((product): FoodSearchResult[] => {
        const name =
            (country === 'gr'
                ? product.product_name_el
                : product.product_name_de) || product.product_name;
        if (!name) {
            return [];
        }

        const nutrients = product.nutriments;
        return [
            {
                alternativeName: null,
                brand: product.brands?.join(', ') ?? null,
                id: product.code,
                name,
                nutrition: {
                    calories: nutrients?.['energy-kcal_100g'] ?? null,
                    carbohydrates: nutrients?.carbohydrates_100g ?? null,
                    fat: nutrients?.fat_100g ?? null,
                    fiber: nutrients?.fiber_100g ?? null,
                    protein: nutrients?.proteins_100g ?? null,
                    salt: nutrients?.salt_100g ?? null,
                    sugar: nutrients?.sugars_100g ?? null,
                },
                quantity: product.quantity ?? null,
                source: 'open-food-facts',
            },
        ];
    });
};

export const searchFoods = async ({
    country,
    query,
}: {
    country: FoodSearchCountry;
    query: string;
}): Promise<FoodSearchResponse> => {
    const bls = searchBlsFoods(query);

    try {
        const openFoodFacts = await searchOpenFoodFacts({ country, query });
        return { data: { bls, openFoodFacts }, warnings: [] };
    } catch (error) {
        console.error('Open Food Facts search failed', error);
        return {
            data: { bls, openFoodFacts: [] },
            warnings: ['open-food-facts-unavailable'],
        };
    }
};
