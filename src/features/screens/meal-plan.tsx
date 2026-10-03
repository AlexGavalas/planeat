'use client';

import { parseISO } from 'date-fns';
import { useEffect } from 'react';

import { Calendar } from '~features/calendar';
import { useCurrentWeek } from '~store/hooks';

export function MealPlan({ initialDate }: Readonly<{ initialDate: string }>) {
    const { goToDate } = useCurrentWeek();

    useEffect(() => {
        goToDate(parseISO(initialDate));
    }, [goToDate, initialDate]);

    return <Calendar initialDate={initialDate} />;
}
