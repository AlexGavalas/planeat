import { Button, Group, Stack, Text } from '@mantine/core';
import { useTranslation } from 'next-i18next';
import { useQuery, useQueryClient } from 'react-query';

import { LoadingOverlay } from '~components/loading-overlay';
import { useProfile } from '~hooks/use-profile';
import { type Notification } from '~types/notification';
import {
    showErrorNotification,
    showSuccessNotification,
} from '~util/notification';

export const ManageConnectionRequests = () => {
    const { t } = useTranslation();
    const { profile } = useProfile();
    const queryClient = useQueryClient();

    const {
        data: connectionRequests = [],
        isFetching: isFetchingConnectionRequests,
    } = useQuery(
        ['connection-requests', profile?.id],
        async () => {
            const response = await fetch(
                '/api/v1/notification?type=connection_request',
            );

            const { data } = await response.json();

            return (data ?? []) as Notification[];
        },
        {
            enabled: Boolean(profile),
        },
    );

    const hasConnectionsRequests =
        !isFetchingConnectionRequests && connectionRequests.length > 0;

    const removeConnectionRequest = async (connectionRequestId: string) => {
        const response = await fetch(
            `/api/v1/notification?id=${connectionRequestId}`,
            {
                method: 'DELETE',
            },
        );

        return await response.json();
    };

    const handleAcceptConnectionRequest = async (
        connectionRequest: Notification,
    ) => {
        const response = await fetch('/api/v1/connection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                connectionUserId: connectionRequest.request_user_id,
            }),
        });

        const { error } = await response.json();

        if (error) {
            showErrorNotification({
                title: t('error'),
                message: t(
                    'connections.manage_connection_requests.accept_error',
                ),
            });
        } else {
            showSuccessNotification({
                title: t('success'),
                message: t(
                    'connections.manage_connection_requests.accept_success',
                ),
            });

            const { error } = await removeConnectionRequest(
                connectionRequest.id,
            );

            if (!error) {
                await queryClient.invalidateQueries([
                    'connection-requests',
                    profile?.id,
                ]);

                await queryClient.invalidateQueries(['connections']);
            }
        }
    };

    const handleDeclineConnectionRequest = async (
        connectionRequestId: string,
    ) => {
        const { error } = await removeConnectionRequest(connectionRequestId);

        if (error) {
            showErrorNotification({
                title: t('error'),
                message: t(
                    'connections.manage_connection_requests.decline_error',
                ),
            });
        } else {
            showSuccessNotification({
                title: t('success'),
                message: t(
                    'connections.manage_connection_requests.decline_success',
                ),
            });

            await queryClient.invalidateQueries([
                'connection-requests',
                profile?.id,
            ]);

            await queryClient.invalidateQueries(['connections']);
        }
    };

    return (
        <Stack gap="md" mt="sm">
            {!hasConnectionsRequests && (
                <Text>
                    {t('connections.manage_connection_requests.no_requests')}
                </Text>
            )}
            {isFetchingConnectionRequests ? (
                <LoadingOverlay visible />
            ) : (
                connectionRequests.map((connectionRequest) => {
                    return (
                        <Group
                            key={connectionRequest.id}
                            justify="space-between"
                        >
                            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                            {/* @ts-ignore */}
                            <Text>{connectionRequest.users.full_name}</Text>
                            <Group gap="xs">
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        handleAcceptConnectionRequest(
                                            connectionRequest,
                                        );
                                    }}
                                >
                                    {t(
                                        'connections.manage_connection_requests.accept',
                                    )}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        handleDeclineConnectionRequest(
                                            connectionRequest.id,
                                        );
                                    }}
                                >
                                    {t(
                                        'connections.manage_connection_requests.decline',
                                    )}
                                </Button>
                            </Group>
                        </Group>
                    );
                })
            )}
        </Stack>
    );
};
