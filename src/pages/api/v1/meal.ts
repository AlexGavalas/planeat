import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiHandler } from 'next';
import invariant from 'tiny-invariant';

import { createMeals, deleteMeals, fetchMeals, updateMeals } from '~api/meal';
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
        const endDate = String(req.query.endDate);
        const startDate = String(req.query.startDate);

        const { data } = await fetchMeals({
            endDate,
            startDate,
            supabase,
            userId: user.id,
        });

        res.json({ data });
    } else if (req.method === 'PATCH' || req.method === 'POST') {
        const { deletedIds, editedMeals, newMeals } = req.body;

        const { error: deleteError } = await deleteMeals({
            deletedIds,
            supabase,
            userId: user.id,
        });

        const { error: updateError } = await updateMeals({
            editedMeals,
            supabase,
            userId: user.id,
        });

        const { error: createError } = await createMeals({
            newMeals,
            supabase,
            userId: user.id,
        });

        const error = deleteError || updateError || createError;

        res.json({ error: error ? 'Could not update or create entry' : null });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default handler;
