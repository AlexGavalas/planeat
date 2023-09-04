import { Box, Divider, Group, Space, Stack } from '@mantine/core';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { endOfDay, startOfDay } from 'date-fns';
import { fromPairs, map } from 'lodash';
import { type GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import invariant from 'tiny-invariant';

import { getServerSession } from '~api/session';
import { fetchUser } from '~api/user';
import { Fab } from '~components/fab';
import { BMITimeline, CurrentBMI } from '~features/bmi';
import { DailyMeal } from '~features/daily-meal';
import { CurrentFat, FatTimeline } from '~features/fat-percent';
import { type MealsMap } from '~types/meal';
import { type Database } from '~types/supabase';
import { getUTCDate } from '~util/date';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createPagesServerClient<Database>(context);

    const session = await getServerSession(context);

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

    const NOW = new Date();

    const startOfDayTimestamp = getUTCDate(startOfDay(NOW)).toUTCString();
    const endOfDayTimestamp = getUTCDate(endOfDay(NOW)).toUTCString();

    const { data } = await supabase
        .from('meals')
        .select('*')
        .gte('day', startOfDayTimestamp)
        .lte('day', endOfDayTimestamp);

    const profile = await fetchUser({ email: user.email, supabase });

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

export default function Home({ dailyMeals }: { dailyMeals: MealsMap }) {
    return (
        <Group p={20} align="start" grow noWrap>
            <Stack
                style={{
                    width: '20%',
                    maxWidth: '20%',
                }}
            >
                <DailyMeal dailyMeals={dailyMeals} />
            </Stack>
            <Divider size="xs" orientation="vertical" />
            <Box
                style={{
                    width: '80%',
                    maxWidth: '80%',
                }}
            >
                <CurrentFat />
                <FatTimeline />
                <Space h="xl" />
                <CurrentBMI />
                <BMITimeline />
            </Box>
            <Fab />
        </Group>
    );
}
