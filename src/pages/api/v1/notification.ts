import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiHandler } from 'next';
import invariant from 'tiny-invariant';
import { ZodError } from 'zod';

import {
    createConnectionRequestNotification,
    deleteConnectionRequestNotification,
    fetchConnectionRequestNotifications,
    fetchNotification,
} from '~api/notification';
import { getServerSession } from '~api/session';
import { fetchUser } from '~api/user';
import { postRequestSchema } from '~schemas/notification';
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
