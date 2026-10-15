import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import type { ReactElement } from 'react';
import { Suspense } from 'react';

import { fetchActivitiesCount, fetchActivitiesPaginated } from '~api/activity';
import {
    fetchMeasurementsCount,
    fetchMeasurementsPaginated,
} from '~api/measurement';
import { requireUser } from '~api/session';
import { TableSectionSkeleton } from '~components/loading-skeleton';
import { INITIAL_PAGE, PAGE_SIZE } from '~constants/pagination';
import { Activities } from '~features/activities';
import { Measurements } from '~features/measurements';
import { Settings } from '~features/screens/settings';
import { createQueryClient } from '~util/query-client';

const getArgs = (
    userId: number,
): { end: number; start: number; userId: number } => ({
    end: PAGE_SIZE - 1,
    start: 0,
    userId,
});

const MeasurementList = async (): Promise<ReactElement> => {
    const profile = await requireUser();
    const args = getArgs(profile.id);
    const [measurements, measurementsCount] = await Promise.all([
        fetchMeasurementsPaginated(args),
        fetchMeasurementsCount(args),
    ]);

    const client = createQueryClient();
    client.setQueryData(['measurements', INITIAL_PAGE], measurements);
    client.setQueryData(['measurements-count'], measurementsCount);

    return (
        <HydrationBoundary state={dehydrate(client)}>
            <Measurements />
        </HydrationBoundary>
    );
};

const ActivityList = async (): Promise<ReactElement> => {
    const profile = await requireUser();
    const args = getArgs(profile.id);
    const [activities, activitiesCount] = await Promise.all([
        fetchActivitiesPaginated(args),
        fetchActivitiesCount(args),
    ]);

    const client = createQueryClient();
    client.setQueryData(['activities', 'page', INITIAL_PAGE], activities);
    client.setQueryData(['activities-count'], activitiesCount);

    return (
        <HydrationBoundary state={dehydrate(client)}>
            <Activities />
        </HydrationBoundary>
    );
};

const Page = (): ReactElement => {
    return (
        <Settings
            activities={
                <Suspense fallback={<TableSectionSkeleton />}>
                    <ActivityList />
                </Suspense>
            }
            measurements={
                <Suspense fallback={<TableSectionSkeleton />}>
                    <MeasurementList />
                </Suspense>
            }
        />
    );
};

export default Page;
