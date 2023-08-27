import { type GetServerSidePropsContext } from 'next';
import { getServerSession as getServerSessionNextAuth } from 'next-auth/next';

import { authOptions } from '../pages/api/auth/[...nextauth]';

export const getServerSession = async (context: GetServerSidePropsContext) => {
    const session = await getServerSessionNextAuth(
        context.req,
        context.res,
        authOptions,
    );

    return session;
};
