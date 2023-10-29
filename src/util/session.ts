import {
    type SupabaseClient,
    createPagesServerClient,
} from '@supabase/auth-helpers-nextjs';
import {
    type NextApiHandler,
    type NextApiRequest,
    type NextApiResponse,
} from 'next';
import invariant from 'tiny-invariant';
import { ZodError } from 'zod';

import { getServerSession } from '~api/session';
import { fetchUser } from '~api/user';
import { type User } from '~types/user';

const ERROR_MESSAGE = Object.freeze({
    NO_EMAIL: 'User must have an email',
    NO_SESSION: 'User must be have a session',
    NO_USER: 'User must exist',
});

const AUTH_ERROR_MESSAGES = Object.freeze([
    `Invariant failed: ${ERROR_MESSAGE.NO_SESSION}`,
    `Invariant failed: ${ERROR_MESSAGE.NO_EMAIL}`,
    `Invariant failed: ${ERROR_MESSAGE.NO_USER}`,
]);

export type NextApiHandlerWithUser = (params: {
    req: NextApiRequest;
    res: NextApiResponse;
    user: User;
    supabase: SupabaseClient;
}) => Promise<void>;

export const withUser =
    (handler: NextApiHandlerWithUser): NextApiHandler =>
    async (req, res) => {
        try {
            const session = await getServerSession({ req, res });

            invariant(session, ERROR_MESSAGE.NO_SESSION);
            invariant(session.user?.email, ERROR_MESSAGE.NO_EMAIL);

            const supabase = createPagesServerClient({ req, res });

            const user = await fetchUser({
                email: session.user.email,
                supabase,
            });

            invariant(user, ERROR_MESSAGE.NO_USER);

            await handler({ req, res, supabase, user });
        } catch (e) {
            console.error(e);

            if (e instanceof ZodError) {
                res.status(400).json({ message: 'Bad Request' });
            } else if (
                e instanceof Error &&
                AUTH_ERROR_MESSAGES.includes(e.message)
            ) {
                res.status(401).json({ message: 'Unauthorized' });
            } else {
                res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    };
