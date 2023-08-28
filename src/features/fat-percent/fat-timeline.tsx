import { Card, Center, Title } from '@mantine/core';
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

export const FatTimeline = () => {
    const { t } = useTranslation();
    const supabaseClient = useSupabaseClient<Database>();
    const { profile: user } = useProfile();

    const { data, isFetching } = useQuery(
        ['fat-percent-timeline'],
        async () => {
            if (!user) throw new Error(`User not logged in`);

            return supabaseClient
                .from('measurements')
                .select('date, fat_percentage')
                .eq('user_id', user.id)
                .not('fat_percentage', 'is', null)
                .gte('date', sub(new Date(), { days: 100 }).toISOString())
                .order('date', { ascending: true });
        },
        {
            enabled: Boolean(user),
            select: ({ data }) =>
                data?.length
                    ? data.map(({ date: x, fat_percentage: y }) => ({ x, y }))
                    : null,
        },
    );

    return (
        <>
            <Title order={4} pt={20}>
                {t('fat_change')}
            </Title>
            <Card
                bg="transparent"
                px={0}
                style={{
                    height: 200,
                    position: 'relative',
                }}
            >
                <LoadingOverlay visible={isFetching} />
                {data && (
                    <LineChart unit="%" data={[{ id: 'fat-percent', data }]} />
                )}
                {!isFetching && !data && (
                    <Center style={{ height: '100%' }}>
                        <Title order={4}>{t('no_measurements_yet')}</Title>
                    </Center>
                )}
            </Card>
        </>
    );
};
