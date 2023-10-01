import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiHandler } from 'next';
import invariant from 'tiny-invariant';
import { ZodError } from 'zod';

import {
    createConnection,
    deleteConnection,
    fetchUserConnections,
} from '~api/connection';
import { getServerSession } from '~api/session';
import { fetchUser } from '~api/user';
import { deleteRequestSchema, postRequestSchema } from '~schemas/connection';
import { assertSession, assertUserEmail } from '~util/session';

const handler: NextApiHandler = async (req, res) => {
    try {
        const session = await getServerSession({ req, res });

        assertSession(session);
        assertUserEmail(session.user?.email);

        const supabase = createPagesServerClient({ req, res });

        const user = await fetchUser({ supabase, email: session.user.email });

        invariant(user, 'User must exist');

        if (req.method === 'GET') {
            const { data } = await fetchUserConnections({
                supabase,
                userId: user.id,
            });

            res.json({ data });
        } else if (req.method === 'DELETE') {
            const { connectionId, connectionUserId } =
                deleteRequestSchema.parse(req.body);

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
                supabase,
                userId: user.id,
                connectionUserId,
            });

            if (error) {
                throw new Error(error.message);
            }

            res.status(200).json({ message: 'OK' });
        } else {
            res.status(405).json({ message: 'Method Not Allowed' });
        }
    } catch (e) {
        console.error(e);

        if (e instanceof ZodError) {
            res.status(400).json({ message: 'Bad Request' });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

export default handler;
