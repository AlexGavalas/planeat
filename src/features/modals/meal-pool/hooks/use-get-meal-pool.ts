import { type UseQueryResult, useQuery } from 'react-query';

type UseGetMealPool = (params: {
    searchQuery: string;
}) => UseQueryResult<string[]>;

export const useGetMealPool: UseGetMealPool = ({ searchQuery }) => {
    return useQuery(
        ['pool-meal', searchQuery],
        async () => {
            const response = await fetch(`/api/v1/pool/meal?q=${searchQuery}`);

            const { data } = (await response.json()) as { data?: string[] };

            return data ?? [];
        },
        {
            enabled: Boolean(searchQuery),
        },
    );
};
