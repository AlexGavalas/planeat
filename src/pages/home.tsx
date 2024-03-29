import { Box, Group, Space, Stack } from '@mantine/core';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { endOfDay, format, startOfDay } from 'date-fns';
import { fromPairs, map } from 'lodash';
import { type GetServerSideProps } from 'next';
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
import { Card } from '~components/card';
import { Fab } from '~components/fab';
import { BMITimeline, CurrentBMI } from '~features/bmi';
import { DailyMeal } from '~features/daily-meal';
import { CurrentFat, FatTimeline } from '~features/fat-percent';
import { type MealsMap } from '~types/meal';
import { type Database } from '~types/supabase';
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

    const startOfDayTimestamp = format(startOfDay(NOW), 'yyyy-MM-dd HH:mm');
    const endOfDayTimestamp = format(endOfDay(NOW), 'yyyy-MM-dd HH:mm');

    const profile = await fetchUser({ email: user.email, supabase });

    invariant(profile, `Profile was not found for user email ${user.email}`);

    const { data } = await fetchMeals({
        endDate: endOfDayTimestamp,
        startDate: startOfDayTimestamp,
        supabase,
        userId: profile.id,
    });

    const dailyMeals = fromPairs(map(data, (item) => [item.section_key, item]));

    await queryClient.prefetchQuery({
        queryFn: () => profile,
        queryKey: ['user'],
    });

    await queryClient.prefetchQuery({
        queryFn: async () => {
            const result = await fetchLatestFatMeasurement({
                supabase,
                userId: profile.id,
            });

            return result.data?.[0]?.fat_percentage ?? 0;
        },
        queryKey: ['current-fat-percent'],
    });

    await queryClient.prefetchQuery({
        queryFn: async () => {
            const result = await fetchLatestWeightMeasurement({
                supabase,
                userId: profile.id,
            });

            return result.data?.[0]?.weight ?? 0;
        },
        queryKey: ['current-weight'],
    });

    await queryClient.prefetchQuery({
        queryFn: async () => {
            const result = await fetchMeasurements({
                supabase,
                userId: profile.id,
            });

            return result.data?.length
                ? result.data.map(({ date: x, weight: y }) => ({ x, y }))
                : null;
        },
        queryKey: ['bmi-timeline'],
    });

    await queryClient.prefetchQuery({
        queryFn: async () => {
            const result = await fetchFatMeasurements({
                supabase,
                userId: profile.id,
            });

            return result.data?.length
                ? result.data.map(({ date: x, fat_percentage: y }) => ({
                      x,
                      y,
                  }))
                : null;
        },
        queryKey: ['fat-percent-timeline'],
    });

    return {
        props: {
            dailyMeals,
            dehydratedState: dehydrate(queryClient),
            user,
            ...(await getServerSideTranslations({ locale: profile.language })),
        },
    };
};

type HomeProps = Readonly<{
    dailyMeals: MealsMap;
}>;

export default function Home({ dailyMeals }: HomeProps) {
    return (
        <Group align="start" wrap="nowrap">
            <Stack
                id="daily-meals-container"
                style={{
                    maxWidth: '20%',
                    width: '20%',
                }}
            >
                <Card>
                    <DailyMeal dailyMeals={dailyMeals} />
                </Card>
            </Stack>
            <Box
                style={{
                    maxWidth: '80%',
                    width: '80%',
                }}
            >
                <Card>
                    <Stack id="fat-container">
                        <CurrentFat />
                        <FatTimeline />
                    </Stack>
                </Card>
                <Space h="md" />
                <Card>
                    <Stack id="weight-container">
                        <CurrentBMI />
                        <BMITimeline />
                    </Stack>
                </Card>
            </Box>
            <Fab />
        </Group>
    );
}
