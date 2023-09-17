import { Card as MantineCard } from '@mantine/core';
import { type PropsWithChildren } from 'react';

import styles from './card.module.css';

export const Card = ({ children }: PropsWithChildren) => {
    return (
        <MantineCard className={styles.glass} shadow="sm">
            {children}
        </MantineCard>
    );
};
