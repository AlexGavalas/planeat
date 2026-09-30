import { Box, Stack } from '@mantine/core';
import { type ReactNode } from 'react';

import { Card } from '~components/card';
import { Fab } from '~components/fab';

import styles from './home.module.css';

type HomeProps = Readonly<{
    dailyMeals: ReactNode;
    measurements: ReactNode;
}>;

export function Home({ dailyMeals, measurements }: HomeProps) {
    return (
        <div className={styles.layout}>
            <Stack className={styles.dailyMeals} id="daily-meals-container">
                <Card>{dailyMeals}</Card>
            </Stack>
            <Box className={styles.measurements}>{measurements}</Box>
            <Fab />
        </div>
    );
}
