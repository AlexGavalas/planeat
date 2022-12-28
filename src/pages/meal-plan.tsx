import { Box } from '@mantine/core';
import {
    getUser,
    supabaseServerClient,
    withPageAuth,
} from '@supabase/auth-helpers-nextjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Calendar } from '~features/calendar';

export const getServerSideProps = withPageAuth({
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
