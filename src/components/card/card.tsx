import { Card as MantineCard } from '@mantine/core';
import type { ReactElement } from 'react';
import { type PropsWithChildren } from 'react';

import styles from './card.module.css';

export const Card = ({ children }: PropsWithChildren): ReactElement => {
    return (
        <MantineCard className={styles.glass} shadow="sm">
            {children}
        </MantineCard>
    );
};
