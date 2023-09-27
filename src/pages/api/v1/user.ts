import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiHandler } from 'next';
import invariant from 'tiny-invariant';

import { getServerSession } from '~api/session';
import {
    deleteProfile,
    fetchUser,
    fetchUserByFullname,
    findUsersByName,
    updateProfile,
} from '~api/user';

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
        if (req.query.type === 'search') {
            const { data } = await findUsersByName({
                supabase,
                userId: user.id,
                fullName: String(req.query.fullName),
            });

            res.json({ data });
        } else if (req.query.type === 'profile') {
            const { data } = await fetchUserByFullname({
                fullName: String(req.query.fullName),
                supabase,
            });

            res.json({ data });
        } else {
            res.json({ data: user });
        }
    } else if (req.method === 'PATCH') {
        const {
            height,
            isDiscoverable,
            language,
            targetWeight,
            hasCompletedOnboarding,
        } = req.body;

        const { data, error } = await updateProfile({
            supabase,
            userId: user.id,
            height,
            isDiscoverable,
            language,
            targetWeight,
            hasCompletedOnboarding,
        });

        res.json({ data, error });
    } else if (req.method === 'DELETE') {
        const { data, error } = await deleteProfile({
            supabase,
            userId: user.id,
        });

        res.json({ data, error });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default handler;
