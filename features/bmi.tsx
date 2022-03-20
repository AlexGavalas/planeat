import dynamic from 'next/dynamic';
import { Box, Title } from '@mantine/core';

import { ProgressIndicator } from '@components/progress/indicator';

const LineChart = dynamic(() => import('@components/charts/line'), {
    ssr: false,
});

const SECTIONS = [
    {
        label: 'Ελλιποβαρές',
        percent: 40,
        bg: '#339af0',
    },
    {
        label: 'Φυσιολογικό',
        percent: 20,
        bg: '#165b99',
    },
    {
        label: 'Υπέρβαρο',
        percent: 10,
        bg: '#32ad4c',
    },
    {
        label: `Παχύσαρκος Α' βαθμού`,
        percent: 15,
        bg: '#ff7600',
    },
    {
        label: `Παχύσαρκος Β'/Γ' βαθμού`,
        percent: 15,
        bg: 'red',
    },
];

const MAX_BMI = 40;

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
