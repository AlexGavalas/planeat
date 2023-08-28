import { Box, Center, Title } from '@mantine/core';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { sub } from 'date-fns';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useQuery } from 'react-query';

import { LoadingOverlay } from '~components/loading-overlay';
import { useProfile } from '~hooks/use-profile';
import { type Database } from '~types/supabase';

const LineChart = dynamic(() => import('~components/charts/line'), {
    ssr: false,
});

export const BMITimeline = () => {
    const { t } = useTranslation();
    const supabaseClient = useSupabaseClient<Database>();
    const { profile: user } = useProfile();

    const { data, isFetching } = useQuery(
        ['bmi-timeline'],
        async () => {
            if (!user) throw new Error(`User not logged in`);

            return supabaseClient
                .from('measurements')
                .select('date, weight')
                .eq('user_id', user.id)
                .not('weight', 'is', null)
                .gte('date', sub(new Date(), { days: 100 }).toISOString())
                .order('date', { ascending: true });
        },
        {
            enabled: Boolean(user),
            select: ({ data }) =>
                data?.length
                    ? data.map(({ date: x, weight: y }) => ({ x, y }))
                    : null,
        },
    );

    return (
        <>
            <Title order={4} pt={20}>
                {t('weight_change')}
            </Title>
            <Box
                bg="transparent"
                px={0}
                style={{
                    height: 200,
                    position: 'relative',
                }}
            >
                <LoadingOverlay visible={isFetching} />
                {data && (
                    <LineChart
                        unit={t('kg')}
                        target={85}
                        data={[{ id: 'bmi-timeline', data }]}
                    />
                )}
                {!isFetching && !data && (
                    <Center style={{ height: '100%' }}>
                        <Title order={4}>{t('no_measurements_yet')}</Title>
                    </Center>
                )}
            </Box>
        </>
    );
};
