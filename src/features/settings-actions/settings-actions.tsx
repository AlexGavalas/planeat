import { Group } from '@mantine/core';
import type { ReactElement } from 'react';
import { type PropsWithChildren } from 'react';

import styles from './settings-actions.module.css';

export const SettingsActions = ({
    children,
}: PropsWithChildren): ReactElement => {
    return (
        <Group className={styles.actions} justify="flex-end">
            {children}
        </Group>
    );
};
