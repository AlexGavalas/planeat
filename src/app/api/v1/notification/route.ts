import {
    createConnectionRequestNotification,
    deleteConnectionRequestNotification,
    fetchConnectionRequestNotifications,
    fetchNotification,
} from '~api/notification';
import { postRequestSchema } from '~schemas/notification';
import { withUser } from '~util/session';

export const GET = withUser(async ({ request, user }) => {
    const query: Partial<Record<string, string>> = Object.fromEntries(
        request.nextUrl.searchParams,
    );

    if (query.type === 'connection_request') {
        const { data } = await fetchConnectionRequestNotifications({
            userId: user.id,
        });

        return Response.json({ data });
    }

    const requestUserId = Number(query.requestUserId);
    const targetUserId = Number(query.targetUserId);

    const data = await fetchNotification({
        requestUserId,
        targetUserId,
    });

    return Response.json({ data: Boolean(data) });
});

export const DELETE = withUser(async ({ request, user }) => {
    const query: Partial<Record<string, string>> = Object.fromEntries(
        request.nextUrl.searchParams,
    );
    const id = String(query.id);

    await deleteConnectionRequestNotification({
        id,
        userId: user.id,
    });

    return Response.json({ message: 'OK' }, { status: 200 });
});

export const POST = withUser(async ({ request, user }) => {
    const { targetUserId } = postRequestSchema.parse(await request.json());

    await createConnectionRequestNotification({
        requestUserId: user.id,
        targetUserId,
    });

    return Response.json({ message: 'OK' }, { status: 200 });
});
