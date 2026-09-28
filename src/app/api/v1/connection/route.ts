import {
    createConnection,
    deleteConnection,
    fetchUserConnections,
} from '~api/connection';
import { deleteRequestSchema, postRequestSchema } from '~schemas/connection';
import { type RouteHandlerWithUser, withUser } from '~util/session';

const handler: RouteHandlerWithUser = async ({ request, user }) => {
    if (request.method === 'GET') {
        const { data } = await fetchUserConnections({
            userId: user.id,
        });

        return Response.json({ data });
    } else if (request.method === 'DELETE') {
        const { connectionId, connectionUserId } = deleteRequestSchema.parse(
            await request.json(),
        );

        await deleteConnection({
            connectionId,
            connectionUserId,
            userId: user.id,
        });

        return Response.json({ message: 'OK' }, { status: 200 });
    } else if (request.method === 'POST') {
        const { connectionUserId } = postRequestSchema.parse(
            await request.json(),
        );

        await createConnection({
            connectionUserId,
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
export { route as GET, route as DELETE, route as POST };
