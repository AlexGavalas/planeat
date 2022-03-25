import dynamic from 'next/dynamic';
import { Box, Center, LoadingOverlay, Title } from '@mantine/core';
import { sub } from 'date-fns';
import { useQuery } from 'react-query';
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';

import { MAX_BMI, SECTIONS } from './constants';
import { ProgressIndicator } from '@components/progress/indicator';

const LineChart = dynamic(() => import('@components/charts/line'), {
    ssr: false,
});

export const CurrentBMI = ({ value }: { value: number }) => {
    return (
        <ProgressIndicator
            label="Δείκτης μάζας σώματος BMI"
            value={value}
            percent={(value * 100) / MAX_BMI}
            sections={SECTIONS}
        />
    );
};

export const BMITimeline = () => {
    const { data, isFetching } = useQuery(
        ['bmi-timeline'],
        async () => {
            return supabaseClient
                .from<WeightMeasurement>('weight-measurements')
                .select('*')
                .gte('date', sub(new Date(), { days: 100 }).toISOString())
                .order('date', { ascending: true });
        },
        {
            select: ({ data }) =>
                data?.length
                    ? data.map(({ date, weight }) => ({
                          y: weight,
                          x: date,
                      }))
                    : null,
        }
    );

    return (
        <>
            <Title order={4} pt={20}>
                Μεταβολή λίπους
            </Title>
            <Box
                style={{
                    height: 200,
                    position: 'relative',
                }}
            >
                <LoadingOverlay visible={isFetching} />
                {data && (
                    <LineChart
                        unit="kg"
                        target={85}
                        data={[{ id: 'bmi-timeline', data }]}
                    />
                )}
                {!isFetching && !data && (
                    <Center style={{ height: '100%' }}>
                        <Title order={4}>
                            Δεν υπάρχουν ακόμα διαθέσιμες μετρήσεις
                        </Title>
                    </Center>
                )}
            </Box>
        </>
    );
};
