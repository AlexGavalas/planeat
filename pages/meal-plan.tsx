import { Box } from '@mantine/core';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import {
    getUser,
    supabaseServerClient,
    withAuthRequired,
} from '@supabase/supabase-auth-helpers/nextjs';

import { Calendar } from '@features/calendar';

export const getServerSideProps = withAuthRequired({
    redirectTo: '/',
    getServerSideProps: async (context) => {
        const { user } = await getUser(context);

        if (!user) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            };
        }

        const { data: profile } = await supabaseServerClient(context)
            .from<Profile>('users')
            .select('language')
            .eq('id', user.id)
            .single();

        return {
            props: {
                ...(await serverSideTranslations(profile?.language || 'en', [
                    'common',
                ])),
            },
        };
    },
});

const MealPlan = () => {
    return (
        <Box p={20}>
            <Calendar />
        </Box>
    );
};

export default MealPlan;
