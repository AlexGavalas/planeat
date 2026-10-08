import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import {
    endOfWeek,
    format,
    isMatch,
    isValid,
    parseISO,
    startOfWeek,
} from 'date-fns';
import { Suspense } from 'react';

import { fetchActivities } from '~api/activity';
import { fetchMeals } from '~api/meal';
import { fetchMealZoneTimes } from '~api/meal-zone';
import { getRequestDate, requireUser } from '~api/session';
import { MealPlanPageSkeleton } from '~components/loading-skeleton';
import { MealPlan } from '~features/screens/meal-plan';
import { createQueryClient } from '~util/query-client';

type MealPlanPageProps = Readonly<{
    searchParams: Promise<{ date?: string }>;
}>;

async function MealPlanContent({ searchParams }: MealPlanPageProps) {
    const profile = await requireUser();
    const { date } = await searchParams;
    const parsedDate =
        date && isMatch(date, 'yyyy-MM-dd') ? parseISO(date) : null;

    const requestedDate = parsedDate && isValid(parsedDate) ? parsedDate : null;
    const now = requestedDate ?? getRequestDate();

    const startDate = format(
        startOfWeek(now, { weekStartsOn: 1 }),
        'yyyy-MM-dd',
    );

    const endDate = format(endOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd');

    const [meals, activities, mealZoneTimes] = await Promise.all([
        fetchMeals({ endDate, startDate, userId: profile.id }),
        fetchActivities({ endDate, startDate, userId: profile.id }),
        fetchMealZoneTimes({ effectiveOn: startDate, userId: profile.id }),
    ]);

    const client = createQueryClient();

    client.setQueryData(['meals', profile.id, startDate], meals.data);
    client.setQueryData(
        ['activities', 'week', profile.id, startDate],
        activities,
    );
    client.setQueryData(['meal-zone-times', profile.id, startDate], {
        data: mealZoneTimes,
        effectiveFrom: startDate,
    });

    return (
        <HydrationBoundary state={dehydrate(client)}>
            <MealPlan
                initialDate={format(now, 'yyyy-MM-dd')}
                ownerUserId={profile.id}
            />
        </HydrationBoundary>
    );
}

export default function Page({ searchParams }: MealPlanPageProps) {
    return (
        <Suspense fallback={<MealPlanPageSkeleton />}>
            <MealPlanContent searchParams={searchParams} />
        </Suspense>
    );
}
