'use client';

import { parseISO } from 'date-fns';
import { useEffect } from 'react';

import { Calendar } from '~features/calendar';
import { MealPlanOwnerProvider } from '~features/meal-plan-owner';
import { useCurrentWeek } from '~store/hooks';

export function MealPlan({
    canEditAnnotations,
    initialDate,
    ownerUserId,
}: Readonly<{
    canEditAnnotations: boolean;
    initialDate: string;
    ownerUserId: number;
}>) {
    const { goToDate } = useCurrentWeek();

    useEffect(() => {
        goToDate(parseISO(initialDate));
    }, [goToDate, initialDate]);

    return (
        <MealPlanOwnerProvider
            canEditAnnotations={canEditAnnotations}
            ownerUserId={ownerUserId}
        >
            <Calendar initialDate={initialDate} />
        </MealPlanOwnerProvider>
    );
}
