import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format, startOfWeek } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { useMealPlanOwnerId } from '~features/meal-plan-owner';
import { type WeeklyMealZone } from '~types/meal-zone';
import {
    showErrorNotification,
    showSuccessNotification,
} from '~util/notification';

import { saveWeeklyMealSchedule } from '../app/weekly-meal-zone-actions';

export const useWeeklyMealZones = (
    currentWeek: Date,
    initialSchedule?: Readonly<{
        weekStart: string;
        zones: WeeklyMealZone[];
    }>,
    explicitOwnerUserId?: number,
): {
    isLoading: boolean;
    save: (zones: WeeklyMealZone[]) => Promise<void>;
    weekStart: string;
    zones: WeeklyMealZone[];
} => {
    const { t } = useTranslation();
    const ownerUserId = useMealPlanOwnerId(explicitOwnerUserId);
    const queryClient = useQueryClient();
    const weekStart = format(
        startOfWeek(currentWeek, { weekStartsOn: 1 }),
        'yyyy-MM-dd',
    );
    const queryKey = ['weekly-meal-zones', ownerUserId, weekStart] as const;
    const query = useQuery({
        enabled: ownerUserId !== -1,
        initialData:
            initialSchedule?.weekStart === weekStart
                ? initialSchedule.zones
                : undefined,
        queryFn: async (): Promise<WeeklyMealZone[]> => {
            const ownerQuery = ownerUserId ? `&ownerUserId=${ownerUserId}` : '';
            const response = await fetch(
                `/api/v1/weekly-meal-zones?weekStart=${weekStart}${ownerQuery}`,
            );
            if (!response.ok) {
                throw new Error('Could not fetch weekly meal zones');
            }
            const result = (await response.json()) as {
                data?: WeeklyMealZone[];
            };
            return result.data ?? [];
        },
        queryKey,
    });
    const mutation = useMutation({
        mutationFn: async (zones: WeeklyMealZone[]): Promise<void> => {
            const response = await saveWeeklyMealSchedule({
                ...(ownerUserId ? { ownerUserId } : {}),
                weekStart,
                zones,
            });
            if (!response.ok) {
                throw new Error('Could not save weekly meal zones');
            }
        },
        onError: (): void => {
            showErrorNotification({
                message: t('meal_plan.schedule.save_error'),
                title: t('notification.error.title'),
            });
        },
        onSuccess: async (): Promise<void> => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey }),
                queryClient.invalidateQueries({
                    queryKey: ownerUserId ? ['meals', ownerUserId] : ['meals'],
                }),
            ]);
            showSuccessNotification({
                message: t('meal_plan.schedule.save_success'),
                title: t('notification.success.title'),
            });
        },
    });

    return {
        isLoading: query.isFetching || mutation.isPending,
        save: mutation.mutateAsync,
        weekStart,
        zones: query.data ?? [],
    };
};
