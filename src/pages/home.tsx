import { Box, Button, Divider, Group, Stack, Text } from '@mantine/core';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { endOfDay, startOfDay } from 'date-fns';
import { fromPairs, map } from 'lodash';
import { type GetServerSideProps } from 'next';
import { type User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import invariant from 'tiny-invariant';

import { BMITimeline, CurrentBMI } from '~features/bmi';
import { DailyMeal } from '~features/daily-meal';
import { FatPercent, FatPercentTimeline } from '~features/fat-percent';
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

    const NOW = new Date();

    const { user } = session;

    invariant(user?.email, 'User email must exist in session');

    const { data } = await supabase
        .from('meals')
        .select('*')
        .gte('day', startOfDay(NOW).toISOString())
        .lte('day', endOfDay(NOW).toISOString());

    const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();

    const dailyMeals = fromPairs(map(data, (item) => [item.section_key, item]));

    return {
        props: {
            dailyMeals,
            user,
            ...(await serverSideTranslations(profile?.language || 'en', [
                'common',
            ])),
        },
    };
};

const Home = ({ user, dailyMeals }: { user: User; dailyMeals: MealsMap }) => {
    const { t } = useTranslation();

    return (
        <Group grow p={20} align="start" noWrap={true}>
            <Stack style={{ maxWidth: '25%' }}>
                <DailyMeal dailyMeals={dailyMeals} />
            </Stack>
            <Box
                pl={20}
                style={{
                    maxWidth: '75%',
                    borderLeft: '1px solid #ced4da',
                }}
            >
                <Text>
                    {t('welcome')}{' '}
                    <Text component="span" weight="bold">
                        {user.name}
                    </Text>
                </Text>
                <Group>
                    <Link href="/meal-plan">
                        <Button>{t('view_weekly_meal')}</Button>
                    </Link>
                    <Link href="/settings">
                        <Button>{t('user_settings')}</Button>
                    </Link>
                </Group>
                <Divider my="lg" />
                <FatPercent />
                <Divider my="sm" />
                <FatPercentTimeline />
                <Divider my="lg" />
                <CurrentBMI />
                <Divider my="sm" />
                <BMITimeline />
            </Box>
        </Group>
    );
};

export default Home;
