import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { endOfDay, format, startOfDay } from 'date-fns';
import { Suspense } from 'react';

import { fetchMeals } from '~api/meal';
import { fetchMeasurementSummary } from '~api/measurement';
import { getRequestDate, requireUser } from '~api/session';
import { DailyMeal } from '~features/daily-meal';
import { Home } from '~features/screens/home';
import { MeasurementDashboard } from '~features/screens/measurement-dashboard';
import { createQueryClient } from '~util/query-client';

import Loading from '../loading';

async function DailyMeals() {
    const profile = await requireUser();
    const now = getRequestDate();
    const meals = await fetchMeals({
        endDate: format(endOfDay(now), 'yyyy-MM-dd HH:mm'),
        startDate: format(startOfDay(now), 'yyyy-MM-dd HH:mm'),
        userId: profile.id,
    });
    return (
        <DailyMeal
            dailyMeals={Object.fromEntries(
                meals.data.map((meal) => [meal.section_key, meal]),
            )}
            date={format(now, "yyyy-MM-dd'T'HH:mm:ss")}
        />
    );
}
async function Measurements() {
    const profile = await requireUser();
    const client = createQueryClient();
    client.setQueryData(
        ['measurement-summary'],
        await fetchMeasurementSummary({ userId: profile.id }),
    );
    return (
        <HydrationBoundary state={dehydrate(client)}>
            <MeasurementDashboard />
        </HydrationBoundary>
    );
}
export default async function Page() {
    await requireUser();
    return (
        <Home
            dailyMeals={
                <Suspense fallback={<Loading />}>
                    <DailyMeals />
                </Suspense>
            }
            measurements={
                <Suspense fallback={<Loading />}>
                    <Measurements />
                </Suspense>
            }
        />
    );
}
