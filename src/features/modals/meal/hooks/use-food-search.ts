import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import {
    type FoodSearchCountry,
    type FoodSearchResponse,
} from '~types/food-search';

const emptyResponse: FoodSearchResponse = {
    data: { bls: [], openFoodFacts: [] },
    warnings: [],
};

export const useFoodSearch = ({
    country,
    query,
}: {
    country: FoodSearchCountry;
    query: string;
}): UseQueryResult<FoodSearchResponse> =>
    useQuery({
        enabled: query.length >= 2,
        placeholderData: emptyResponse,
        queryFn: async () => {
            const parameters = new URLSearchParams({ country, q: query });
            const response = await fetch(`/api/v1/food/search?${parameters}`);

            if (!response.ok) {
                throw new Error('Food search failed');
            }
            return (await response.json()) as FoodSearchResponse;
        },
        queryKey: ['food-search', query, country],
        retry: false,
        staleTime: 60 * 60 * 1000,
    });
