import Link from 'next/link';
import { startOfDay, endOfDay } from 'date-fns';
import { fromPairs, map } from 'lodash';

import {
    AppShell,
    Button,
    Group,
    Text,
    Navbar,
    Box,
    createStyles,
    Divider,
} from '@mantine/core';

import {
    getUser,
    withAuthRequired,
    User,
    supabaseClient,
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

        const { data } = await supabaseClient
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

const useStyles = createStyles({
    navbar: {
        '--mantine-header-height': '5rem',
    },
});

const Home = ({ user, dailyMeals }: { user: User; dailyMeals: MealsMap }) => {
    const { classes } = useStyles();

    const userCurrentStats = {
        fatPercent: 28.9,
        weight: 88.8,
        height: 1.74,
    };

    const userBMI = +(
        userCurrentStats.weight /
        userCurrentStats.height ** 2
    ).toFixed(1);

    return (
        <AppShell
            navbar={
                <Navbar width={{ base: 300 }} p={20} className={classes.navbar}>
                    <DailyMeal dailyMeals={dailyMeals} />
                </Navbar>
            }
        >
            <Group>
                <Text size="lg">
                    Welcome{' '}
                    <span style={{ fontWeight: 'bold' }}>
                        {user.user_metadata.name}
                    </span>
                </Text>
            </Group>
            <Group>
                <Link href="/meal-plan" passHref>
                    <Button component="a">View weekly meal plan</Button>
                </Link>
                <Link href="/settings" passHref>
                    <Button component="a">User settings</Button>
                </Link>
            </Group>
            <Divider my="lg" />
            <Box>
                <FatPercent value={userCurrentStats.fatPercent} />
                <FatPercentTimeline />
                <Divider my="lg" />
                <CurrentBMI value={userBMI} />
                <BMITimeline />
            </Box>
        </AppShell>
    );
};

export default Home;
