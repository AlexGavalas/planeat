import { getServerSession as getNextAuthSession } from 'next-auth/next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import 'server-only';

import { E2E_REQUEST_DATE_HEADER } from '~constants/e2e';
import { type UserProfile } from '~types/user';
import { resolveRequestDate } from '~util/request-date';

import { authOptions } from './auth-options';
import { fetchUser } from './user';

export const getServerSession = cache(() => getNextAuthSession(authOptions));
export const getCurrentUser = cache(async () => {
    const session = await getServerSession();
    return session?.user?.email
        ? fetchUser({ email: session.user.email })
        : null;
});
export const requireUser = async (): Promise<UserProfile> => {
    const user = await getCurrentUser();
    if (!user) {
        redirect('/');
    }
    return user;
};

// Share one calendar snapshot between the root provider and page loaders. Local
// E2E owns the server environment; hosted E2E forwards the same date to Vercel
// preview requests. Production never honors the test-only request header.
export const getRequestDate = cache(async (): Promise<Date> => {
    const isPreview = process.env.VERCEL_ENV === 'preview';
    const headerDate = isPreview
        ? (await headers()).get(E2E_REQUEST_DATE_HEADER)
        : null;

    return resolveRequestDate({
        allowHeaderDate: isPreview,
        environmentDate: process.env.E2E_REQUEST_DATE,
        headerDate,
    });
});
