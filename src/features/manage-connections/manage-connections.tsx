import { Stack, Text } from '@mantine/core';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';

import { LoadingOverlay } from '~components/loading-overlay';
import { useProfile } from '~hooks/use-profile';
import { type Connection } from '~types/connection';
import { showErrorNotification } from '~util/notification';

import { ConnectionItem } from './connection';

export const ManageConnections = () => {
    const { t } = useTranslation();
    const { profile } = useProfile();
    const queryClient = useQueryClient();

    const { data: connections = [], isFetching: isFetchingConnections } =
        useQuery({
            enabled: Boolean(profile),
            queryFn: async () => {
                const response = await fetch('/api/v1/connection');

                const { data } = (await response.json()) as {
                    data?: Connection[];
                };

                return data ?? [];
            },
            queryKey: ['connections'],
        });

    const removeConnection = async (connection: Connection) => {
        const response = await fetch('/api/v1/connection', {
            body: JSON.stringify({
                connectionId: connection.id,
                connectionUserId: connection.connection_user_id,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'DELETE',
        });

        if (!response.ok) {
            showErrorNotification({
                message: t(
                    'connections.manage_connections.remove_connection_error',
                ),
                title: t('notification.error.title'),
            });
        } else {
            await queryClient.invalidateQueries({
                queryKey: ['connections'],
            });
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
                    <ConnectionItem
                        key={connection.id}
                        connection={connection}
                        removeConnection={removeConnection}
                    />
                );
            })}
        </Stack>
    );
};
