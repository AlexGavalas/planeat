'use client';

import { Center, Loader } from '@mantine/core';
import dynamic from 'next/dynamic';
import { type ReactElement } from 'react';

const CenterLoader = (): ReactElement => (
    <Center py="md">
        <Loader />
    </Center>
);

export const modals = {
    activity: dynamic(
        () => import('./modals/activity').then((m) => m.ActivityModal),
        { loading: CenterLoader },
    ),
    'delete-account': dynamic(
        () =>
            import('./modals/delete-account').then((m) => m.DeleteAccountModal),
        { loading: CenterLoader },
    ),
    meal: dynamic(() => import('./modals/meal').then((m) => m.MealModal), {
        loading: CenterLoader,
    }),
    'meal-note': dynamic(
        () => import('./modals/meal-note').then((m) => m.MealNoteModal),
        { loading: CenterLoader },
    ),
    'meal-pool': dynamic(
        () => import('./modals/meal-pool').then((m) => m.MealPoolModal),
        { loading: CenterLoader },
    ),
    'meal-rating': dynamic(
        () => import('./modals/meal-rating').then((m) => m.MealRatingModal),
        { loading: CenterLoader },
    ),
    measurement: dynamic(
        () => import('./modals/measurement').then((m) => m.MeasurementModal),
        { loading: CenterLoader },
    ),
    'week-overview': dynamic(
        () => import('./modals/week-overview').then((m) => m.WeekOverviewModal),
        { loading: CenterLoader },
    ),
} as const;

declare module '@mantine/modals' {
    // oxlint-disable-next-line typescript/consistent-type-definitions -- Mantine requires module augmentation.
    interface MantineModalsOverride {
        modals: typeof modals;
    }
}
