import { format, isMatch, parseISO, startOfWeek } from 'date-fns';

import { requireMealPlanAccess } from '~api/professional';
import { fetchWeeklyMealZones } from '~api/weekly-meal-zone';
import { withUser } from '~util/session';

export const GET = withUser(async ({ request, user }) => {
    const weekStart = request.nextUrl.searchParams.get('weekStart') ?? '';
    const owner = request.nextUrl.searchParams.get('ownerUserId');
    const ownerUserId = owner ? Number(owner) : user.id;

    if (
        !isMatch(weekStart, 'yyyy-MM-dd') ||
        format(
            startOfWeek(parseISO(weekStart), { weekStartsOn: 1 }),
            'yyyy-MM-dd',
        ) !== weekStart ||
        !Number.isSafeInteger(ownerUserId) ||
        ownerUserId <= 0
    ) {
        return Response.json({ message: 'Bad Request' }, { status: 400 });
    }

    await requireMealPlanAccess({ actorUserId: user.id, ownerUserId });

    return Response.json({
        data: await fetchWeeklyMealZones({ userId: ownerUserId, weekStart }),
    });
});
