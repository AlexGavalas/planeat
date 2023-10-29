import {
    createConnection,
    deleteConnection,
    fetchUserConnections,
} from '~api/connection';
import { deleteRequestSchema, postRequestSchema } from '~schemas/connection';
import { type NextApiHandlerWithUser, withUser } from '~util/session';

const handler: NextApiHandlerWithUser = async ({
    req,
    res,
    supabase,
    user,
}) => {
    if (req.method === 'GET') {
        const { data } = await fetchUserConnections({
            supabase,
            userId: user.id,
        });

        res.json({ data });
    } else if (req.method === 'DELETE') {
        const { connectionId, connectionUserId } = deleteRequestSchema.parse(
            req.body,
        );

        const { error } = await deleteConnection({
            connectionId,
            connectionUserId,
            supabase,
            userId: user.id,
        });

        if (error) {
            throw new Error(error.message);
        }

        res.status(200).json({ message: 'OK' });
    } else if (req.method === 'POST') {
        const { connectionUserId } = postRequestSchema.parse(req.body);

        const { error } = await createConnection({
            connectionUserId,
            supabase,
            userId: user.id,
        });

        if (error) {
            throw new Error(error.message);
        }

        res.status(200).json({ message: 'OK' });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default withUser(handler);
