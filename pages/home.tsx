import Link from 'next/link';
import { startOfDay, endOfDay } from 'date-fns';
import { AppShell, Button, Group, Text, Navbar } from '@mantine/core';
import {
    getUser,
    withAuthRequired,
    User,
    supabaseClient,
} from '@supabase/supabase-auth-helpers/nextjs';

import { DailyMeal } from '@features/daily-meal';

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
                props: {},
            };
        }

        const NOW = new Date();

        const { data } = await supabaseClient
            .from<Meal>('meals')
            .select('*')
            .gte('day', startOfDay(NOW).toISOString())
            .lte('day', endOfDay(NOW).toISOString());

        const dailyMeals = data?.reduce((acc: MealsMap, meal) => {
            acc[meal.section_key] = meal;
            return acc;
        }, {});

        return {
            props: {
                dailyMeals: dailyMeals || {},
                user,
            },
        };
    },
});

const Home = ({ user, dailyMeals }: { user: User; dailyMeals: MealsMap }) => {
    return (
        <AppShell
            navbar={
                <Navbar width={{ base: 300 }} p={20} height="100%">
                    <DailyMeal dailyMeals={dailyMeals} />
                </Navbar>
            }
        >
            <Group direction="column">
                <Text size="lg">
                    Welcome{' '}
                    <span style={{ fontWeight: 'bold' }}>
                        {user.user_metadata.name}
                    </span>
                </Text>
            </Group>
            <Group>
                <Link href="/meal-plan" passHref>
                    <Button component="a">View meal plan</Button>
                </Link>
            </Group>
        </AppShell>
    );
};

export default Home;
