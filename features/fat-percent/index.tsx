import dynamic from 'next/dynamic';
import { Box, Center, LoadingOverlay, Title } from '@mantine/core';
import { useQuery } from 'react-query';
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';

import { MAX_FAT_PERCENT, SECTIONS } from './constants';
import { ProgressIndicator } from '@components/progress/indicator';

const LineChart = dynamic(() => import('@components/charts/line'), {
    ssr: false,
});

export const FatPercent = ({ value }: { value: number }) => {
    return (
        <ProgressIndicator
            label="Ποσοστό λίπους"
            value={value}
            percent={(value * 100) / MAX_FAT_PERCENT}
            sections={SECTIONS}
        />
    );
};

export const FatPercentTimeline = () => {
    const { data, isFetching } = useQuery(['fat-percent'], async () => {
        // const {} = await supabaseClient.from('weight-measurements');
    });

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
                    <LineChart unit="%" data={[{ id: 'fat-percent', data }]} />
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
