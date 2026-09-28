'use client';

import { Space, Stack } from '@mantine/core';

import { Card } from '~components/card';
import { BMITimeline, CurrentBMI } from '~features/bmi';
import { CurrentFat, FatTimeline } from '~features/fat-percent';

export function MeasurementDashboard() {
    return (
        <>
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
        </>
    );
}
