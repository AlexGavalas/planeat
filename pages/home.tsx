import Link from 'next/link';
import { startOfDay, endOfDay } from 'date-fns';
import { fromPairs, map } from 'lodash';
import { Button, Group, Text, Box, Divider } from '@mantine/core';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import {
    getUser,
    withAuthRequired,
    User,
    supabaseServerClient,
} from '@supabase/supabase-auth-helpers/nextjs';

import { DailyMeal } from '@features/daily-meal';
import { FatPercent, FatPercentTimeline } from '@features/fat-percent';
import { BMITimeline, CurrentBMI } from '@features/bmi';

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

        const NOW = new Date();

        const { data } = await supabaseServerClient(context)
            .from<Meal>('meals')
            .select('*')
            .gte('day', startOfDay(NOW).toISOString())
            .lte('day', endOfDay(NOW).toISOString());

        const { data: profile } = await supabaseServerClient(context)
            .from<Profile>('users')
            .select('language')
            .eq('id', user.id)
            .single();

        const dailyMeals = fromPairs(
            map(data, (item) => [item.section_key, item])
        );

        return {
            props: {
                dailyMeals,
                user,
                ...(await serverSideTranslations(profile?.language || 'en', [
                    'common',
                ])),
            },
        };
    },
});

const USER_TEST_DATA = {
    fatPercent: 28.9,
    weight: 88.8,
    height: 1.74,
};

const Home = ({ user, dailyMeals }: { user: User; dailyMeals: MealsMap }) => {
    const { t } = useTranslation();

    return (
        <Group grow p={20} align="start">
            <Group direction="column" style={{ maxWidth: '25%' }}>
                <DailyMeal dailyMeals={dailyMeals} />
            </Group>
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
                    <Link href="/meal-plan" passHref>
                        <Button component="a">{t('view_weekly_meal')}</Button>
                    </Link>
                    <Link href="/settings" passHref>
                        <Button component="a">{t('user_settings')}</Button>
                    </Link>
                </Group>
                <Divider my="lg" />
                <FatPercent value={USER_TEST_DATA.fatPercent} />
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
