import { Box, Button, Divider, Group, Stack, Text } from '@mantine/core';
import {
    type User,
    createServerSupabaseClient,
} from '@supabase/auth-helpers-nextjs';
import { endOfDay, startOfDay } from 'date-fns';
import { fromPairs, map } from 'lodash';
import { type GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';

import { BMITimeline, CurrentBMI } from '~features/bmi';
import { DailyMeal } from '~features/daily-meal';
import { FatPercent, FatPercentTimeline } from '~features/fat-percent';
import { type Database } from '~types/supabase';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createServerSupabaseClient<Database>(context);

    const {
        data: { session },
    } = await supabase.auth.getSession();

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

    const { data } = await supabase
        .from('meals')
        .select('*')
        .gte('day', startOfDay(NOW).toISOString())
        .lte('day', endOfDay(NOW).toISOString());

    const { data: profile } = await supabase
        .from('users')
        .select('language')
        .eq('id', user.id)
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
                        {user.user_metadata.name}
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
