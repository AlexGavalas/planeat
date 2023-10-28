import { type UseQueryResult, useQuery } from '@tanstack/react-query';

type UseGetMealPool = (params: {
    searchQuery: string;
}) => UseQueryResult<string[]>;

export const useGetMealPool: UseGetMealPool = ({ searchQuery }) => {
    return useQuery({
        enabled: Boolean(searchQuery),
        queryFn: async () => {
            const response = await fetch(`/api/v1/pool/meal?q=${searchQuery}`);

            const { data } = (await response.json()) as { data?: string[] };

            return data ?? [];
        },
        queryKey: ['pool-meal', searchQuery],
    });
};
