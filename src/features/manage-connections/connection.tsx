import { Button, Group, Paper, Text } from '@mantine/core';
import { type MouseEventHandler, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { type Connection } from '~types/connection';

import styles from './connection.module.css';

type ConnectionItemProps = Readonly<{
    connection: Connection;
    removeConnection: (connection: Connection) => Promise<void>;
}>;

export const ConnectionItem = ({
    connection,
    removeConnection,
}: ConnectionItemProps) => {
    const { t } = useTranslation();

    const handleRemoveConnection = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(async () => {
        await removeConnection(connection);
    }, [connection, removeConnection]);

    return (
        <Paper withBorder p="md" role="listitem">
            <Group className={styles.row} justify="space-between">
                {/* eslint-disable @typescript-eslint/no-unsafe-member-access */}
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-expect-error */}
                <Text fw={600}>{connection.users.full_name}</Text>
                <Button
                    className={styles.removeButton}
                    onClick={handleRemoveConnection}
                    variant="outline"
                >
                    {t('connections.manage_connections.remove_connection')}
                </Button>
            </Group>
        </Paper>
    );
};
