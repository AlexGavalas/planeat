import { Box, Divider, Group, Space, Stack } from '@mantine/core';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { endOfDay, startOfDay, sub } from 'date-fns';
import { fromPairs, map } from 'lodash';
import { type GetServerSideProps } from 'next';
import { QueryClient, dehydrate } from 'react-query';
import invariant from 'tiny-invariant';

import { fetchMeals } from '~api/meal';
import {
    fetchFatMeasurements,
    fetchLatestFatMeasurement,
    fetchLatestWeightMeasurement,
    fetchMeasurements,
} from '~api/measurement';
import { getServerSession } from '~api/session';
import { fetchUser } from '~api/user';
import { Fab } from '~components/fab';
import { BMITimeline, CurrentBMI } from '~features/bmi';
import { DailyMeal } from '~features/daily-meal';
import { CurrentFat, FatTimeline } from '~features/fat-percent';
import { type MealsMap } from '~types/meal';
import { type Database } from '~types/supabase';
import { getUTCDate } from '~util/date';
import { getServerSideTranslations } from '~util/i18n';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const queryClient = new QueryClient();

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

    const { data } = await fetchMeals({
        supabase,
        endDate: endOfDayTimestamp,
        startDate: startOfDayTimestamp,
    });

    const dailyMeals = fromPairs(map(data, (item) => [item.section_key, item]));

    const profile = await fetchUser({ email: user.email, supabase });

    invariant(profile, `Profile was not found for user email ${user.email}`);

    await queryClient.prefetchQuery(['user'], async () => profile);

    await queryClient.prefetchQuery(['current-fat-percent'], async () => {
        const result = await fetchLatestFatMeasurement({
            supabase,
            userId: profile.id,
        });

        return result.data?.[0].fat_percentage ?? 0;
    });

    await queryClient.prefetchQuery(['current-weight'], async () => {
        const result = await fetchLatestWeightMeasurement({
            supabase,
            userId: profile.id,
        });

        return result.data?.[0].weight ?? 0;
    });

    const startDate = getUTCDate(sub(new Date(), { years: 1 })).toUTCString();

    await queryClient.prefetchQuery(['bmi-timeline'], async () => {
        const result = await fetchMeasurements({
            startDate,
            supabase,
            userId: profile.id,
        });

        return result.data?.length
            ? result.data.map(({ date: x, weight: y }) => ({ x, y }))
            : null;
    });

    await queryClient.prefetchQuery(['fat-percent-timeline'], async () => {
        const result = await fetchFatMeasurements({
            startDate,
            supabase,
            userId: profile.id,
        });

        return result.data?.length
            ? result.data.map(({ date: x, fat_percentage: y }) => ({ x, y }))
            : null;
    });

    return {
        props: {
            dailyMeals,
            user,
            dehydratedState: dehydrate(queryClient),
            ...(await getServerSideTranslations({ locale: profile.language })),
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
