import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { endOfDay, format, startOfDay } from 'date-fns';
import { Suspense } from 'react';

import { fetchMeals } from '~api/meal';
import { fetchMealZoneTimes } from '~api/meal-zone';
import { fetchMeasurementSummary } from '~api/measurement';
import { getRequestDate, requireUser } from '~api/session';
import { HomePageSkeleton } from '~components/loading-skeleton';
import { Home } from '~features/screens/home';
import { createQueryClient } from '~util/query-client';

async function HomeContent() {
    const profile = await requireUser();
    const now = await getRequestDate();
    const day = format(now, 'yyyy-MM-dd');
    const [meals, mealZoneTimes, measurementSummary] = await Promise.all([
        fetchMeals({
            endDate: format(endOfDay(now), 'yyyy-MM-dd HH:mm'),
            startDate: format(startOfDay(now), 'yyyy-MM-dd HH:mm'),
            userId: profile.id,
        }),
        fetchMealZoneTimes({ effectiveOn: day, userId: profile.id }),
        fetchMeasurementSummary({ userId: profile.id }),
    ]);

    const client = createQueryClient();
    client.setQueryData(['measurement-summary'], measurementSummary);

    return (
        <HydrationBoundary state={dehydrate(client)}>
            <Home
                dailyMeals={Object.fromEntries(
                    meals.data.map((meal) => [meal.section_key, meal]),
                )}
                date={format(now, "yyyy-MM-dd'T'HH:mm:ss")}
                fullName={profile.full_name}
                mealZoneTimes={mealZoneTimes}
                targetWeight={profile.target_weight}
            />
        </HydrationBoundary>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<HomePageSkeleton />}>
            <HomeContent />
        </Suspense>
    );
}
