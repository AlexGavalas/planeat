import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import { type GetServerSideProps } from 'next';
import { QueryClient, dehydrate } from 'react-query';
import invariant from 'tiny-invariant';

import { fetchActivities } from '~api/activity';
import { fetchMeals } from '~api/meal';
import { getServerSession } from '~api/session';
import { fetchUser } from '~api/user';
import { Calendar } from '~features/calendar';
import { type Database } from '~types/supabase';
import { getServerSideTranslations } from '~util/i18n';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const queryClient = new QueryClient();

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

    invariant(profile, `Profile was not found for user email ${user.email}`);

    const NOW = new Date();

    const endDate = format(endOfWeek(NOW, { weekStartsOn: 1 }), 'yyyy-MM-dd');

    const startDate = format(
        startOfWeek(NOW, { weekStartsOn: 1 }),
        'yyyy-MM-dd',
    );

    await queryClient.prefetchQuery(['user'], () => profile);

    const currentWeekKey = format(NOW, 'yyyy-MM-dd');

    await queryClient.prefetchQuery(['meals', currentWeekKey], async () => {
        const result = await fetchMeals({
            supabase,
            endDate,
            startDate,
            userId: profile.id,
        });

        return result.data ?? [];
    });

    await queryClient.prefetchQuery(
        ['activities', currentWeekKey],
        async () => {
            const result = await fetchActivities({
                supabase,
                endDate,
                startDate,
                userId: profile.id,
            });

            return result.data ?? [];
        },
    );

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
            ...(await getServerSideTranslations({ locale: profile.language })),
        },
    };
};

export default function MealPlan() {
    return <Calendar />;
}
