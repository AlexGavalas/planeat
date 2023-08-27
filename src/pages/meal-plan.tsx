import { Box } from '@mantine/core';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { type GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import invariant from 'tiny-invariant';

import { Calendar } from '~features/calendar';
import { type Database } from '~types/supabase';

import { authOptions } from './api/auth/[...nextauth]';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createPagesServerClient<Database>(context);

    const session = await getServerSession(
        context.req,
        context.res,
        authOptions,
    );

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

    const { data: profile } = await supabase
        .from('users')
        .select('language')
        .eq('email', user.email)
        .single();

    return {
        props: {
            ...(await serverSideTranslations(profile?.language || 'en', [
                'common',
            ])),
        },
    };
};

const MealPlan = () => {
    return (
        <Box p={20}>
            <Calendar />
        </Box>
    );
};

export default MealPlan;
