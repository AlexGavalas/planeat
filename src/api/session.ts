import { getServerSession as getNextAuthSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import 'server-only';

import { type UserProfile } from '~types/user';

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

// Share the same calendar snapshot between the root provider and page loaders.
// The override keeps browser screenshots deterministic without affecting normal
// environments, where E2E_REQUEST_DATE is unset.
export const getRequestDate = cache(() =>
    process.env.E2E_REQUEST_DATE
        ? new Date(process.env.E2E_REQUEST_DATE)
        : new Date(),
);
