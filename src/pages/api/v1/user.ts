import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiHandler } from 'next';
import invariant from 'tiny-invariant';
import { ZodError } from 'zod';

import { getServerSession } from '~api/session';
import {
    deleteProfile,
    fetchUser,
    fetchUserByFullname,
    findUsersByName,
    updateProfile,
} from '~api/user';
import { patchRequestSchema } from '~schemas/user';
import { assertSession, assertUserEmail } from '~util/session';

const handler: NextApiHandler = async (req, res) => {
    try {
        const session = await getServerSession({ req, res });

        assertSession(session);
        assertUserEmail(session.user?.email);

        const supabase = createPagesServerClient({ req, res });

        const user = await fetchUser({ email: session.user.email, supabase });

        invariant(user, 'User must exist');

        if (req.method === 'GET') {
            if (req.query.type === 'search') {
                const { data } = await findUsersByName({
                    fullName: String(req.query.fullName),
                    supabase,
                    userId: user.id,
                });

                res.json({
                    data: data?.map(({ full_name }) => full_name),
                });
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
            } = patchRequestSchema.parse(req.body);

            const { error } = await updateProfile({
                hasCompletedOnboarding,
                height,
                isDiscoverable,
                language,
                supabase,
                targetWeight,
                userId: user.id,
            });

            if (error) {
                throw new Error(error.message);
            }

            res.status(200).json({ message: 'OK' });
        } else if (req.method === 'DELETE') {
            const { error } = await deleteProfile({
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
