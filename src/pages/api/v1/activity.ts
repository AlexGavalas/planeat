import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiHandler } from 'next';
import invariant from 'tiny-invariant';
import { ZodError } from 'zod';

import {
    deleteActivity,
    fetchActivitiesCount,
    fetchActivitiesPaginated,
    updateActivity,
} from '~api/activity';
import { getServerSession } from '~api/session';
import { fetchUser } from '~api/user';
import { patchRequestSchema } from '~schemas/activity';
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
            if (req.query.count === 'true') {
                const count = await fetchActivitiesCount({
                    supabase,
                    userId: user.id,
                });

                res.json({ count });
            } else {
                const end = Number(req.query.end);
                const start = Number(req.query.start);

                const data = await fetchActivitiesPaginated({
                    end,
                    start,
                    supabase,
                    userId: user.id,
                });

                res.json({ data });
            }
        } else if (req.method === 'DELETE') {
            const { error } = await deleteActivity({
                supabase,
                activityId: String(req.query.id),
                userId: user.id,
            });

            if (error) {
                throw new Error(error.message);
            }

            res.status(200).json({ message: 'OK' });
        } else if (req.method === 'PATCH' || req.method === 'POST') {
            const { activity, date } = patchRequestSchema.parse(req.body);

            const { error } = await updateActivity({
                activity,
                date,
                activityId: req.query.id ? String(req.query.id) : undefined,
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
