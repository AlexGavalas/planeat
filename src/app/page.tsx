import { redirect } from 'next/navigation';

import { getCurrentUser } from '~api/session';
import { LandingPage } from '~features/screens/index';

export default async function Page() {
    const user = await getCurrentUser();
    if (user) {
        redirect(
            user.roles.includes('professional') ? '/professional' : '/home',
        );
    }

    return <LandingPage />;
}
