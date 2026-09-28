import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { fetchActivitiesCount, fetchActivitiesPaginated } from '~api/activity';
import {
    fetchMeasurementsCount,
    fetchMeasurementsPaginated,
} from '~api/measurement';
import { requireUser } from '~api/session';
import { INITIAL_PAGE, PAGE_SIZE } from '~constants/pagination';
import { Settings } from '~features/screens/settings';
import { createQueryClient } from '~util/query-client';

export default async function Page() {
    const profile = await requireUser();
    const args = { end: PAGE_SIZE - 1, start: 0, userId: profile.id };
    const [measurements, measurementsCount, activities, activitiesCount] =
        await Promise.all([
            fetchMeasurementsPaginated(args),
            fetchMeasurementsCount(args),
            fetchActivitiesPaginated(args),
            fetchActivitiesCount(args),
        ]);
    const client = createQueryClient();
    client.setQueryData(['measurements', INITIAL_PAGE], measurements);
    client.setQueryData(['measurements-count'], measurementsCount);
    client.setQueryData(['activities', 'page', INITIAL_PAGE], activities);
    client.setQueryData(['activities-count'], activitiesCount);
    return (
        <HydrationBoundary state={dehydrate(client)}>
            <Settings />
        </HydrationBoundary>
    );
}
