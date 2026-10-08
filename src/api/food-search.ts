import 'server-only';

import {
    type FoodSearchCountry,
    type FoodSearchResponse,
} from '~types/food-search';

import { searchBlsFoods } from './food-search/bls';
import { searchOpenFoodFacts } from './food-search/open-food-facts';

export { searchBlsFoods } from './food-search/bls';
export { searchOpenFoodFacts } from './food-search/open-food-facts';

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
