import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiHandler } from 'next';
import invariant from 'tiny-invariant';
import { ZodError } from 'zod';

import { createMeals, deleteMeals, fetchMeals, updateMeals } from '~api/meal';
import { getServerSession } from '~api/session';
import { fetchUser } from '~api/user';
import { patchRequestSchema } from '~schemas/meal';
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
            const endDate = String(req.query.endDate);
            const startDate = String(req.query.startDate);

            const { data } = await fetchMeals({
                endDate,
                startDate,
                supabase,
                userId: user.id,
            });

            res.json({ data });
        } else if (req.method === 'PATCH') {
            const { deletedIds, editedMeals, newMeals } =
                patchRequestSchema.parse(req.body);

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

            const error = deleteError ?? updateError ?? createError;

            if (error) {
                throw new Error(error.message, { cause: error });
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
