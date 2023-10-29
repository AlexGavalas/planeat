import {
    createConnectionRequestNotification,
    deleteConnectionRequestNotification,
    fetchConnectionRequestNotifications,
    fetchNotification,
} from '~api/notification';
import { postRequestSchema } from '~schemas/notification';
import { type NextApiHandlerWithUser, withUser } from '~util/session';

const handler: NextApiHandlerWithUser = async ({
    req,
    res,
    supabase,
    user,
}) => {
    if (req.method === 'GET') {
        if (req.query.type === 'connection_request') {
            const { data } = await fetchConnectionRequestNotifications({
                supabase,
                userId: user.id,
            });

            res.json({ data });
        } else {
            const requestUserId = Number(req.query.requestUserId);
            const targetUserId = Number(req.query.targetUserId);

            const data = await fetchNotification({
                requestUserId,
                supabase,
                targetUserId,
            });

            res.json({ data: Boolean(data) });
        }
    } else if (req.method === 'DELETE') {
        const id = String(req.query.id);

        const { error } = await deleteConnectionRequestNotification({
            id,
            supabase,
            userId: user.id,
        });

        if (error) {
            throw new Error(error.message);
        }

        res.status(200).json({ message: 'OK' });
    } else if (req.method === 'POST') {
        const { targetUserId } = postRequestSchema.parse(req.body);

        const { error } = await createConnectionRequestNotification({
            requestUserId: user.id,
            supabase,
            targetUserId,
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
