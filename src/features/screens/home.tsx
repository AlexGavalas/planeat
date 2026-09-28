import { Box, Group, Stack } from '@mantine/core';
import { type ReactNode } from 'react';

import { Card } from '~components/card';
import { Fab } from '~components/fab';

type HomeProps = Readonly<{
    dailyMeals: ReactNode;
    measurements: ReactNode;
}>;

export function Home({ dailyMeals, measurements }: HomeProps) {
    return (
        <Group align="start" wrap="nowrap">
            <Stack
                id="daily-meals-container"
                style={{
                    maxWidth: '20%',
                    width: '20%',
                }}
            >
                <Card>{dailyMeals}</Card>
            </Stack>
            <Box
                style={{
                    maxWidth: '80%',
                    width: '80%',
                }}
            >
                {measurements}
            </Box>
            <Fab />
        </Group>
    );
}
