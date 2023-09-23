import { Button, Group, Stack, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useTranslation } from 'next-i18next';
import { useQuery, useQueryClient } from 'react-query';

import { LoadingOverlay } from '~components/loading-overlay';
import { useProfile } from '~hooks/use-profile';
import { type Connection } from '~types/connection';

export const ManageConnections = () => {
    const { t } = useTranslation();
    const { profile } = useProfile();
    const queryClient = useQueryClient();

    const { data: connections = [], isFetching: isFetchingConnections } =
        useQuery(
            ['connections'],
            async () => {
                const response = await fetch('/api/v1/connection');

                const { data } = await response.json();

                return (data ?? []) as Connection[];
            },
            {
                enabled: Boolean(profile),
            },
        );

    const removeConnection = async (connection: Connection) => {
        const response = await fetch('/api/v1/connection', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                connectionId: connection.id,
                connectionUserId: connection.connection_user_id,
            }),
        });

        const { error } = await response.json();

        if (error) {
            showNotification({
                color: 'red',
                title: t('error'),
                message: t(
                    'connections.manage_connections.remove_connection_error',
                ),
            });
        } else {
            queryClient.invalidateQueries(['connections']);
        }
    };

    const hasConnections = !isFetchingConnections && connections.length > 0;

    return (
        <Stack gap="md" mt="sm">
            <LoadingOverlay visible={isFetchingConnections} />
            {!hasConnections && (
                <Text>
                    {t('connections.manage_connections.no_connections')}
                </Text>
            )}
            {connections.map((connection) => {
                return (
                    <Group key={connection.id} justify="space-between">
                        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                        {/* @ts-ignore */}
                        <Text>{connection.users.full_name}</Text>
                        <Group gap="xs">
                            <Button
                                size="compact-md"
                                onClick={() => removeConnection(connection)}
                            >
                                {t(
                                    'connections.manage_connections.remove_connection',
                                )}
                            </Button>
                        </Group>
                    </Group>
                );
            })}
        </Stack>
    );
};
