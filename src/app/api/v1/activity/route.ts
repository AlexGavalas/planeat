import {
    deleteActivity,
    fetchActivities,
    fetchActivitiesCount,
    fetchActivitiesPaginated,
    updateActivity,
} from '~api/activity';
import { patchRequestSchema } from '~schemas/activity';
import { type RouteHandlerWithUser, withUser } from '~util/session';

export const GET = withUser(async ({ request, user }) => {
    const query: Partial<Record<string, string>> = Object.fromEntries(
        request.nextUrl.searchParams,
    );

    if (query.startDate && query.endDate) {
        const data = await fetchActivities({
            endDate: query.endDate,
            startDate: query.startDate,
            userId: user.id,
        });

        return Response.json({ data });
    } else if (query.count === 'true') {
        const count = await fetchActivitiesCount({
            userId: user.id,
        });

        return Response.json({ count });
    }

    const end = Number(query.end);
    const start = Number(query.start);

    const data = await fetchActivitiesPaginated({
        end,
        start,
        userId: user.id,
    });

    return Response.json({ data });
});

export const DELETE = withUser(async ({ request, user }) => {
    const query: Partial<Record<string, string>> = Object.fromEntries(
        request.nextUrl.searchParams,
    );

    await deleteActivity({
        activityId: String(query.id),
        userId: user.id,
    });

    return Response.json({ message: 'OK' }, { status: 200 });
});

const updateActivityHandler: RouteHandlerWithUser = async ({
    request,
    user,
}) => {
    const query: Partial<Record<string, string>> = Object.fromEntries(
        request.nextUrl.searchParams,
    );

    const { activity, date } = patchRequestSchema.parse(await request.json());

    await updateActivity({
        activity,
        activityId: query.id,
        date,
        userId: user.id,
    });

    return Response.json({ message: 'OK' }, { status: 200 });
};

export const PATCH = withUser(updateActivityHandler);
export const POST = withUser(updateActivityHandler);
