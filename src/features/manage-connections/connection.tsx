import { Button, Group, Paper, Text } from '@mantine/core';
import { type MouseEventHandler, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { type Connection, type ConnectionWithUser } from '~types/connection';

import styles from './connection.module.css';

type ConnectionItemProps = Readonly<{
    connection: ConnectionWithUser;
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
                <Text fw="var(--mantine-font-weight-semibold)">
                    {connection.users.full_name}
                </Text>
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
