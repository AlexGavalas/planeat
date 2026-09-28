import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { endOfWeek, format, startOfWeek } from 'date-fns';

import { fetchActivities } from '~api/activity';
import { fetchMeals } from '~api/meal';
import { getRequestDate, requireUser } from '~api/session';
import { MealPlan } from '~features/screens/meal-plan';
import { createQueryClient } from '~util/query-client';

export default async function Page() {
    const profile = await requireUser();
    const now = getRequestDate();
    const startDate = format(
        startOfWeek(now, { weekStartsOn: 1 }),
        'yyyy-MM-dd',
    );
    const endDate = format(endOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd');
    const [meals, activities] = await Promise.all([
        fetchMeals({ endDate, startDate, userId: profile.id }),
        fetchActivities({ endDate, startDate, userId: profile.id }),
    ]);
    const client = createQueryClient();
    client.setQueryData(['meals', startDate], meals.data);
    client.setQueryData(['activities', 'week', startDate], activities);
    return (
        <HydrationBoundary state={dehydrate(client)}>
            <MealPlan />
        </HydrationBoundary>
    );
}
