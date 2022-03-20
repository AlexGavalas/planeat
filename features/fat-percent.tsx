import dynamic from 'next/dynamic';
import { Box, Title } from '@mantine/core';

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
    return (
        <>
            <Title order={4} pt={20}>
                Μεταβολή λίπους
            </Title>
            <Box style={{ height: 200, overflow: 'hidden' }}>
                <LineChart />
            </Box>
        </>
    );
};
