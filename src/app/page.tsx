import { redirect } from 'next/navigation';

import { getServerSession } from '~api/session';
import { LandingPage } from '~features/screens/index';

export default async function Page() {
    if (await getServerSession()) {
        redirect('/home');
    }

    return <LandingPage />;
}
