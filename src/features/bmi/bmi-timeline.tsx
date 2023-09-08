import { Box, Center, Title } from '@mantine/core';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { sub } from 'date-fns';
import { useTranslation } from 'next-i18next';
import { useQuery } from 'react-query';

import { fetchMeasurements } from '~api/measurement';
import LineChart from '~components/charts/line';
import { LoadingOverlay } from '~components/loading-overlay';
import { useProfile } from '~hooks/use-profile';
import { type Database } from '~types/supabase';
import { getUTCDate } from '~util/date';

export const BMITimeline = () => {
    const { t } = useTranslation();
    const supabase = useSupabaseClient<Database>();
    const { profile } = useProfile();

    const { data, isFetching } = useQuery(
        ['bmi-timeline'],
        async () => {
            if (!profile) {
                throw new Error(`User not logged in`);
            }

            const startDate = getUTCDate(
                sub(new Date(), { years: 1 }),
            ).toUTCString();

            const result = await fetchMeasurements({
                startDate,
                supabase,
                userId: profile.id,
            });

            return result.data?.length
                ? result.data.map(({ date: x, weight: y }) => ({ x, y }))
                : null;
        },
        {
            enabled: Boolean(profile),
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
                        target={Number(profile?.target_weight)}
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
