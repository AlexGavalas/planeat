import {
    type GetServerSidePropsContext,
    type NextApiRequest,
    type NextApiResponse,
} from 'next';
import { type Session } from 'next-auth';
import { getServerSession as getServerSessionNextAuth } from 'next-auth/next';

import { authOptions } from '../pages/api/auth/[...nextauth]';

type APIContext = {
    req: NextApiRequest;
    res: NextApiResponse;
};

export const getServerSession = async (
    context: GetServerSidePropsContext | APIContext,
): Promise<Session | null> => {
    const session = await getServerSessionNextAuth(
        context.req,
        context.res,
        authOptions,
    );

    return session;
};
