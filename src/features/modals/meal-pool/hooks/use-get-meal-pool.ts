import { type UseQueryResult, useQuery } from '@tanstack/react-query';

export type MealPoolSearchResults = {
    client: string[];
    own: string[];
};

type UseGetMealPool = (params: {
    includeClient?: boolean;
    ownerUserId?: number;
    searchQuery: string;
}) => UseQueryResult<string[] | MealPoolSearchResults>;

export const useGetMealPool: UseGetMealPool = ({
    includeClient = false,
    ownerUserId,
    searchQuery,
}) => {
    return useQuery({
        enabled: Boolean(searchQuery),
        queryFn: async () => {
            const query = new URLSearchParams({ q: searchQuery });
            if (includeClient && ownerUserId) {
                query.set('includeClient', 'true');
                query.set('ownerUserId', String(ownerUserId));
            }
            const response = await fetch(`/api/v1/pool/meal?${query}`);

            const { data } = (await response.json()) as {
                data?: string[] | MealPoolSearchResults;
            };

            return data ?? (includeClient ? { client: [], own: [] } : []);
        },
        queryKey: [
            'pool-meal',
            includeClient ? ownerUserId : 'own',
            searchQuery,
        ],
    });
};
