import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { type GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import invariant from 'tiny-invariant';

import { getServerSession } from '~api/session';
import { fetchUser } from '~api/user';
import { Calendar } from '~features/calendar';
import { type Database } from '~types/supabase';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createPagesServerClient<Database>(context);

    const session = await getServerSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    const { user } = session;

    invariant(user?.email, 'User email must exist in session');

    const profile = await fetchUser({ email: user.email, supabase });

    return {
        props: {
            ...(await serverSideTranslations(profile?.language || 'en', [
                'common',
            ])),
        },
    };
};

export default function MealPlan() {
    return <Calendar />;
}
