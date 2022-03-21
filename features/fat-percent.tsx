import dynamic from 'next/dynamic';
import { Box, Center, Container, LoadingOverlay, Title } from '@mantine/core';
import { useQuery } from 'react-query';
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';

import { ProgressIndicator } from '@components/progress/indicator';

const LineChart = dynamic(() => import('@components/charts/line'), {
    ssr: false,
});

const SECTIONS = [
    {
        label: 'Ελλιποβαρές',
        percent: 15,
        bg: '#339af0',
    },
    {
        label: 'Αθλητικό',
        percent: 15,
        bg: '#165b99',
    },
    {
        label: 'Ιδανικό',
        percent: 10,
        bg: '#32ad4c',
    },
    {
        label: 'Μέσος όρος',
        percent: 15,
        bg: '#ff7600',
    },
    {
        label: 'Παχύσαρκο',
        percent: 45,
        bg: 'red',
    },
];

const MAX_FAT_PERCENT = 40;

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
                    overflow: 'hidden',
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
