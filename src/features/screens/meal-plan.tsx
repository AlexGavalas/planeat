'use client';

import { parseISO } from 'date-fns';
import { useEffect } from 'react';

import { Calendar } from '~features/calendar';
import { DeepLinkedMealModal } from '~features/calendar/deep-linked-meal-modal';
import { MealPlanOwnerProvider } from '~features/meal-plan-owner';
import { useCurrentWeek } from '~store/hooks';
import { type MealZoneKey } from '~types/meal-zone';

export function MealPlan({
    canEditAnnotations,
    initialDate,
    initialMealZone,
    ownerUserId,
}: Readonly<{
    canEditAnnotations: boolean;
    initialDate: string;
    initialMealZone?: MealZoneKey;
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
            <DeepLinkedMealModal
                date={initialDate}
                mealZone={initialMealZone}
            />
            <Calendar initialDate={initialDate} />
        </MealPlanOwnerProvider>
    );
}
