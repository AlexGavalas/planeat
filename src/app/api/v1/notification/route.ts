import {
    createConnectionRequestNotification,
    deleteConnectionRequestNotification,
    fetchConnectionRequestNotifications,
    fetchNotification,
} from '~api/notification';
import { postRequestSchema } from '~schemas/notification';
import { type RouteHandlerWithUser, withUser } from '~util/session';

const handler: RouteHandlerWithUser = async ({ request, user }) => {
    const query: Partial<Record<string, string>> = Object.fromEntries(
        request.nextUrl.searchParams,
    );

    if (request.method === 'GET') {
        if (query.type === 'connection_request') {
            const { data } = await fetchConnectionRequestNotifications({
                userId: user.id,
            });

            return Response.json({ data });
        } else {
            const requestUserId = Number(query.requestUserId);
            const targetUserId = Number(query.targetUserId);

            const data = await fetchNotification({
                requestUserId,
                targetUserId,
            });

            return Response.json({ data: Boolean(data) });
        }
    } else if (request.method === 'DELETE') {
        const id = String(query.id);

        await deleteConnectionRequestNotification({
            id,
            userId: user.id,
        });

        return Response.json({ message: 'OK' }, { status: 200 });
    } else if (request.method === 'POST') {
        const { targetUserId } = postRequestSchema.parse(await request.json());

        await createConnectionRequestNotification({
            requestUserId: user.id,
            targetUserId,
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

export { route as GET, route as DELETE, route as POST };
