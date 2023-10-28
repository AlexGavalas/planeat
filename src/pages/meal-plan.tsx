import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import { type GetServerSideProps } from 'next';
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

    await queryClient.prefetchQuery({
        queryFn: () => profile,
        queryKey: ['user'],
    });

    const currentWeekKey = format(NOW, 'yyyy-MM-dd');

    await queryClient.prefetchQuery({
        queryFn: async () => {
            const result = await fetchMeals({
                endDate,
                startDate,
                supabase,
                userId: profile.id,
            });

            return result.data ?? [];
        },
        queryKey: ['meals', currentWeekKey],
    });

    await queryClient.prefetchQuery({
        queryFn: async () => {
            const result = await fetchActivities({
                endDate,
                startDate,
                supabase,
                userId: profile.id,
            });

            return result;
        },
        queryKey: ['activities', currentWeekKey],
    });

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
