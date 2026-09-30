import {
    createConnection,
    deleteConnection,
    fetchUserConnections,
} from '~api/connection';
import { deleteRequestSchema, postRequestSchema } from '~schemas/connection';
import { withUser } from '~util/session';

export const GET = withUser(async ({ user }) => {
    const { data } = await fetchUserConnections({
        userId: user.id,
    });

    return Response.json({ data });
});

export const DELETE = withUser(async ({ request, user }) => {
    const { connectionId, connectionUserId } = deleteRequestSchema.parse(
        await request.json(),
    );

    await deleteConnection({
        connectionId,
        connectionUserId,
        userId: user.id,
    });

    return Response.json({ message: 'OK' }, { status: 200 });
});

export const POST = withUser(async ({ request, user }) => {
    const { connectionUserId } = postRequestSchema.parse(await request.json());

    await createConnection({
        connectionUserId,
        userId: user.id,
    });

    return Response.json({ message: 'OK' }, { status: 200 });
});
