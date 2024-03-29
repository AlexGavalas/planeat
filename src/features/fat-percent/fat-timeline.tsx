import { Center, Title } from '@mantine/core';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';

import { fetchFatMeasurements } from '~api/measurement';
import { LineChart } from '~components/charts/line';
import { LoadingOverlay } from '~components/loading-overlay';
import { useProfile } from '~hooks/use-profile';
import { type Database } from '~types/supabase';

export const FatTimeline = () => {
    const { t } = useTranslation();
    const supabase = useSupabaseClient<Database>();
    const { profile } = useProfile();

    const { data, isFetching } = useQuery({
        queryFn: async () => {
            if (!profile) {
                throw new Error(`User not logged in`);
            }

            const { data } = await fetchFatMeasurements({
                supabase,
                userId: profile.id,
            });

            return data?.length
                ? data.map(({ date: x, fat_percentage: y }) => ({ x, y }))
                : null;
        },
        queryKey: ['fat-percent-timeline'],
    });

    return (
        <>
            <Title order={4} pt={20}>
                {t('fat_change')}
            </Title>
            <div
                style={{
                    height: 200,
                    position: 'relative',
                }}
            >
                <LoadingOverlay visible={isFetching} />
                {data && (
                    <LineChart data={[{ data, id: 'fat-percent' }]} unit="%" />
                )}
                {!isFetching && !data && (
                    <Center style={{ height: '100%' }}>
                        <Title order={4}>{t('no_measurements_yet')}</Title>
                    </Center>
                )}
            </div>
        </>
    );
};
