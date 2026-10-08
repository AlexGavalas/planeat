import {
    addWeeks,
    format,
    isMatch,
    isValid,
    parseISO,
    startOfWeek,
} from 'date-fns';

import { fetchMealZoneTimes } from '~api/meal-zone';
import { requireMealPlanAccess } from '~api/professional';
import { getRequestDate } from '~api/session';
import { withUser } from '~util/session';

export const GET = withUser(async ({ request, user }) => {
    const requestedWeek = request.nextUrl.searchParams.get('weekStart');
    const requestedOwner = request.nextUrl.searchParams.get('ownerUserId');
    const ownerUserId = requestedOwner ? Number(requestedOwner) : user.id;

    if (!Number.isSafeInteger(ownerUserId) || ownerUserId <= 0) {
        return Response.json({ message: 'Bad Request' }, { status: 400 });
    }
    const parsedWeek =
        requestedWeek && isMatch(requestedWeek, 'yyyy-MM-dd')
            ? parseISO(requestedWeek)
            : null;

    if (requestedWeek && (!parsedWeek || !isValid(parsedWeek))) {
        return Response.json({ message: 'Invalid weekStart' }, { status: 400 });
    }

    const effectiveDate = parsedWeek
        ? startOfWeek(parsedWeek, { weekStartsOn: 1 })
        : addWeeks(startOfWeek(getRequestDate(), { weekStartsOn: 1 }), 1);
    const effectiveFrom = format(effectiveDate, 'yyyy-MM-dd');
    await requireMealPlanAccess({ actorUserId: user.id, ownerUserId });
    const data = await fetchMealZoneTimes({
        effectiveOn: effectiveFrom,
        userId: ownerUserId,
    });

    return Response.json({ data, effectiveFrom });
});
