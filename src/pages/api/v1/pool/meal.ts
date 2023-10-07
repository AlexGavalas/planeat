import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiHandler } from 'next';
import invariant from 'tiny-invariant';
import { ZodError } from 'zod';

import { createMealInPool, fetchMealPool } from '~api/meal-pool';
import { getServerSession } from '~api/session';
import { fetchUser } from '~api/user';
import { postRequestSchema } from '~schemas/meal-pool';
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
            const { q } = req.query;

            const data = await fetchMealPool({
                q: String(q),
                supabase,
                userId: user.id,
            });

            res.json({
                data: data.map(({ content }) => content),
            });
        } else if (req.method === 'POST') {
            const { content } = postRequestSchema.parse(req.body);

            const { error } = await createMealInPool({
                content,
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
