import 'server-only';
import { z } from 'zod';

import {
    type FoodSearchCountry,
    type FoodSearchResult,
} from '~types/food-search';

const RESULT_LIMIT = 8;
const URL = 'https://search.openfoodfacts.org/search';
const USER_AGENT = 'Planeat/0.0.1 (https://github.com/AlexGavalas/planeat)';
const nullableNumber = z.number().finite().nullable().optional();
const responseSchema = z.object({
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
const countryTags: Record<Exclude<FoodSearchCountry, 'all'>, string> = {
    de: 'en:germany',
    gr: 'en:greece',
};
const sanitizeQuery = (query: string): string =>
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
    const safeQuery = sanitizeQuery(query);
    const filteredQuery =
        country === 'all'
            ? safeQuery
            : `${safeQuery} countries_tags:"${countryTags[country]}"`;
    const response = await fetch(URL, {
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
            langs: country === 'gr' ? ['el', 'en'] : ['de', 'en'],
            page_size: RESULT_LIMIT,
            q: filteredQuery,
        }),
        cache: 'force-cache',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': USER_AGENT,
        },
        method: 'POST',
        next: { revalidate: 60 * 60 * 24 },
        signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) {
        throw new Error(`Open Food Facts responded with ${response.status}`);
    }

    const parsed = responseSchema.parse(await response.json());
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
