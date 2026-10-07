import { useQuery } from '@tanstack/react-query';
import { format, startOfWeek } from 'date-fns';

import { DEFAULT_MEAL_ZONE_TIMES } from '~constants/calendar';
import { type MealZoneTimes } from '~types/meal-zone';

export const useMealZoneTimes = (
    date?: Date,
): {
    effectiveFrom?: string;
    isFetching: boolean;
    times: MealZoneTimes;
} => {
    const weekStart = date
        ? format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd')
        : undefined;

    const { data, isFetching } = useQuery({
        queryFn: async () => {
            const query = weekStart ? `?weekStart=${weekStart}` : '';
            const response = await fetch(`/api/v1/meal-zone-times${query}`);
            const result = (await response.json()) as {
                data?: MealZoneTimes;
                effectiveFrom?: string;
            };

            if (!response.ok || !result.data) {
                throw new Error('Could not fetch meal zone times');
            }

            return result;
        },
        queryKey: ['meal-zone-times', weekStart ?? 'next-week'],
    });

    return {
        effectiveFrom: data?.effectiveFrom,
        isFetching,
        times: data?.data ?? DEFAULT_MEAL_ZONE_TIMES,
    };
};
