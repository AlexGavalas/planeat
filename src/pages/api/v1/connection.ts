import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiHandler } from 'next';
import invariant from 'tiny-invariant';

import {
    createConnection,
    deleteConnection,
    fetchUserConnections,
} from '~api/connection';
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
        const { data } = await fetchUserConnections({
            supabase,
            userId: user.id,
        });

        res.json({ data });
    } else if (req.method === 'DELETE') {
        const { connectionId, connectionUserId } = req.body;

        const { error } = await deleteConnection({
            connectionId,
            connectionUserId,
            supabase,
            userId: user.id,
        });

        res.json({ error: error ? 'Could not delete entry' : null });
    } else if (req.method === 'POST') {
        const { connectionUserId } = req.body;

        const { error } = await createConnection({
            supabase,
            userId: user.id,
            connectionUserId,
        });

        res.json({ error: error ? 'Could not update or create entry' : null });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default handler;
