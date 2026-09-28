import {
    deleteActivity,
    fetchActivities,
    fetchActivitiesCount,
    fetchActivitiesPaginated,
    updateActivity,
} from '~api/activity';
import { patchRequestSchema } from '~schemas/activity';
import { type RouteHandlerWithUser, withUser } from '~util/session';

const handler: RouteHandlerWithUser = async ({ request, user }) => {
    const query: Partial<Record<string, string>> = Object.fromEntries(
        request.nextUrl.searchParams,
    );

    if (request.method === 'GET') {
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
        } else {
            const end = Number(query.end);
            const start = Number(query.start);

            const data = await fetchActivitiesPaginated({
                end,
                start,
                userId: user.id,
            });

            return Response.json({ data });
        }
    } else if (request.method === 'DELETE') {
        await deleteActivity({
            activityId: String(query.id),
            userId: user.id,
        });

        return Response.json({ message: 'OK' }, { status: 200 });
    } else if (request.method === 'PATCH' || request.method === 'POST') {
        const { activity, date } = patchRequestSchema.parse(
            await request.json(),
        );

        await updateActivity({
            activity,
            activityId: query.id,
            date,
            userId: user.id,
        });

        return Response.json({ message: 'OK' }, { status: 200 });
    } else {
        return Response.json(
            { message: 'Method Not Allowed' },
            { status: 405 },
        );
    }
};

const route = withUser(handler);

export { route as GET, route as DELETE, route as PATCH, route as POST };
