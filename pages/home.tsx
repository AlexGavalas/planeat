import Link from 'next/link';
import { startOfDay, endOfDay } from 'date-fns';
import { fromPairs, map } from 'lodash';
import { Button, Group, Text, Box, Divider } from '@mantine/core';

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
        const { user } = await getUser(context).catch(() => ({ user: null }));

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

        const dailyMeals = fromPairs(
            map(data, (item) => [item.section_key, item])
        );

        return {
            props: {
                dailyMeals,
                user,
            },
        };
    },
});

const calculateBMI = ({ weight, height }: { weight: number; height: number }) =>
    weight / height ** 2;

const USER_TEST_DATA = {
    fatPercent: 28.9,
    weight: 88.8,
    height: 1.74,
};

const Home = ({ user, dailyMeals }: { user: User; dailyMeals: MealsMap }) => {
    const userBMI = +calculateBMI(USER_TEST_DATA).toFixed(1);

    return (
        <Group grow p={20} align="start">
            <Group direction="column" style={{ maxWidth: '25%' }}>
                <DailyMeal dailyMeals={dailyMeals} />
            </Group>
            <Box
                pl={20}
                style={{
                    maxWidth: '100%',
                    borderLeft: '1px solid #ced4da',
                }}
            >
                <Text>
                    Welcome{' '}
                    <Text component="span" weight="bold">
                        {user.user_metadata.name}
                    </Text>
                </Text>
                <Group>
                    <Link href="/meal-plan" passHref>
                        <Button component="a">View weekly meal plan</Button>
                    </Link>
                    <Link href="/settings" passHref>
                        <Button component="a">User settings</Button>
                    </Link>
                </Group>
                <Divider my="lg" />
                <FatPercent value={USER_TEST_DATA.fatPercent} />
                <Divider my="sm" />
                <FatPercentTimeline />
                <Divider my="lg" />
                <CurrentBMI value={userBMI} />
                <Divider my="sm" />
                <BMITimeline />
            </Box>
        </Group>
    );
};

export default Home;
