import { redirect } from 'next/navigation';
import type { ReactElement } from 'react';

import { getCurrentUser } from '~api/session';
import { LandingPage } from '~features/screens/index';

const Page = async (): Promise<ReactElement> => {
    const user = await getCurrentUser();
    if (user) {
        redirect(
            user.roles.includes('professional') ? '/professional' : '/home',
        );
    }

    return <LandingPage />;
};

export default Page;
