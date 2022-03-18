import {
    getUser,
    withAuthRequired,
    User,
    supabaseClient,
} from '@supabase/supabase-auth-helpers/nextjs';

import { startOfDay, endOfDay, format } from 'date-fns';
import { CrackedEgg, OrangeSliceAlt, AppleHalf, Bbq } from 'iconoir-react';
import Link from 'next/link';

import { AppShell, Button, Group, Timeline, Text, Navbar } from '@mantine/core';
import { ROWS } from '@features/calendar/constants';

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

        const mealsOfTheDay = data?.reduce((acc: MealsMap, meal) => {
            acc[meal.section_key] = meal;
            return acc;
        }, {});

        return {
            props: {
                mealsOfTheDay: mealsOfTheDay || {},
                user,
            },
        };
    },
});

type T = typeof AppleHalf;

const MEAL_ICON: Record<Row, T> = {
    Morning: CrackedEgg,
    'Snack 1': AppleHalf,
    'Snack 2': AppleHalf,
    Lunch: OrangeSliceAlt,
    Dinner: Bbq,
};

const Home = ({
    user,
    mealsOfTheDay,
}: {
    user: User;
    mealsOfTheDay: MealsMap;
}) => {
    return (
        <AppShell
            navbar={
                <Navbar width={{ base: 300 }} p={20} height="100%">
                    <Text align="center" pb={20} weight="bold">
                        Meals of the day
                    </Text>
                    <Timeline active={1} bulletSize={40}>
                        {ROWS.map((row) => {
                            const key = `${row}_${format(
                                new Date(),
                                'EEE dd/MM/yyyy'
                            )}`;

                            const meal = mealsOfTheDay[key]?.meal || 'N/A';

                            const Icon = MEAL_ICON[row];

                            return (
                                <Timeline.Item
                                    key={key}
                                    title={row}
                                    bullet={<Icon />}
                                >
                                    <Text>{meal}</Text>
                                </Timeline.Item>
                            );
                        })}
                    </Timeline>
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
