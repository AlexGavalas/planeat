import { useQuery } from '@tanstack/react-query';
import { format, startOfWeek } from 'date-fns';

import { DEFAULT_MEAL_ZONE_TIMES } from '~constants/calendar';
import { useMealPlanOwnerId } from '~features/meal-plan-owner';
import { type MealZoneTimes } from '~types/meal-zone';

export const useMealZoneTimes = (
    date?: Date,
    explicitOwnerUserId?: number,
): {
    effectiveFrom?: string;
    isFetching: boolean;
    times: MealZoneTimes;
} => {
    const ownerUserId = useMealPlanOwnerId(explicitOwnerUserId);
    const weekStart = date
        ? format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd')
        : undefined;

    const { data, isFetching } = useQuery({
        queryFn: async () => {
            const query = new URLSearchParams();
            if (weekStart) {
                query.set('weekStart', weekStart);
            }
            if (ownerUserId) {
                query.set('ownerUserId', String(ownerUserId));
            }
            const queryString = query.toString();
            const response = await fetch(
                `/api/v1/meal-zone-times${queryString ? `?${queryString}` : ''}`,
            );
            const result = (await response.json()) as {
                data?: MealZoneTimes;
                effectiveFrom?: string;
            };

            if (!response.ok || !result.data) {
                throw new Error('Could not fetch meal zone times');
            }

            return result;
        },
        queryKey: ['meal-zone-times', ownerUserId, weekStart ?? 'next-week'],
    });

    return {
        effectiveFrom: data?.effectiveFrom,
        isFetching,
        times: data?.data ?? DEFAULT_MEAL_ZONE_TIMES,
    };
};
