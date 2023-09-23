import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiHandler } from 'next';
import invariant from 'tiny-invariant';

import {
    createConnectionRequestNotification,
    deleteConnectionRequestNotification,
    fetchConnectionRequestNotifications,
    fetchNotification,
} from '~api/notification';
import { getServerSession } from '~api/session';
import { fetchUser } from '~api/user';

const handler: NextApiHandler = async (req, res) => {
    const supabase = createPagesServerClient({ req, res });

    const session = await getServerSession({ req, res });

    if (!session || !session.user?.email) {
        return res.status(401).json({
            error: 'The user does not have an active session or is not authenticated',
        });
    }

    const user = await fetchUser({ supabase, email: session.user.email });

    invariant(user, 'User must exist');

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
                targetUserId,
                supabase,
            });

            res.json({ data });
        }
    } else if (req.method === 'DELETE') {
        const id = String(req.query.id);

        const { error } = await deleteConnectionRequestNotification({
            id,
            supabase,
            userId: user.id,
        });

        res.json({ error: error ? 'Could not delete entry' : null });
    } else if (req.method === 'POST') {
        const { targetUserId } = req.body;

        const { error } = await createConnectionRequestNotification({
            requestUserId: user.id,
            supabase,
            targetUserId,
        });

        res.json({ error: error ? 'Could not update or create entry' : null });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default handler;
