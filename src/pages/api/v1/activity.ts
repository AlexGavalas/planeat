import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { endOfDay, parseISO } from 'date-fns';
import type { NextApiHandler } from 'next';
import invariant from 'tiny-invariant';

import {
    deleteActivity,
    fetchActivitiesCount,
    fetchActivitiesPaginated,
    updateActivity,
} from '~api/activity';
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

        res.json({ error: error ? 'Could not delete entry' : null });
    } else if (req.method === 'PATCH' || req.method === 'POST') {
        const { date, activity } = req.body;

        const { error } = await updateActivity({
            activity,
            date: endOfDay(parseISO(date)).toISOString(),
            activityId: req.query.id ? String(req.query.id) : undefined,
            supabase,
            userId: user.id,
        });

        res.json({ error: error ? 'Could not update or create entry' : null });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default handler;
