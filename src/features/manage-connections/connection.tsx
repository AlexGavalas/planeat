import { Button, Group, Text } from '@mantine/core';
import { useTranslation } from 'next-i18next';
import { type MouseEventHandler, useCallback } from 'react';

import { type Connection } from '~types/connection';

type ConnectionItemProps = {
    connection: Connection;
    removeConnection: (connection: Connection) => Promise<void>;
};

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
        <Group key={connection.id} justify="space-between">
            {/* eslint-disable @typescript-eslint/no-unsafe-member-access */}
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-expect-error */}
            <Text>{connection.users.full_name}</Text>
            <Group gap="xs">
                <Button onClick={handleRemoveConnection} size="compact-md">
                    {t('connections.manage_connections.remove_connection')}
                </Button>
            </Group>
        </Group>
    );
};
