import { Button, Group, Stack, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useTranslation } from 'next-i18next';
import { useQuery, useQueryClient } from 'react-query';

import { LoadingOverlay } from '~components/loading-overlay';
import { useProfile } from '~hooks/use-profile';
import { type Notification } from '~types/notification';

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

    const removeConnectionRequest = async ({
        connectionRequestId,
        shouldShowNotification = true,
    }: {
        connectionRequestId: string;
        shouldShowNotification: boolean;
    }) => {
        const response = await fetch(
            `/api/v1/notification?id=${connectionRequestId}`,
            {
                method: 'DELETE',
            },
        );

        const { error } = await response.json();

        if (error) {
            if (shouldShowNotification) {
                showNotification({
                    title: t('error'),
                    message: t(
                        'connections.manage_connection_requests.decline_error',
                    ),
                    color: 'red',
                });
            }
        } else {
            if (shouldShowNotification) {
                showNotification({
                    title: t('success'),
                    message: t(
                        'connections.manage_connection_requests.decline_success',
                    ),
                });
            }

            await queryClient.invalidateQueries([
                'connection-requests',
                profile?.id,
            ]);

            await queryClient.invalidateQueries(['connections']);
        }
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
            showNotification({
                title: t('error'),
                message: t(
                    'connections.manage_connection_requests.accept_error',
                ),
                color: 'red',
            });
        } else {
            showNotification({
                title: t('success'),
                message: t(
                    'connections.manage_connection_requests.accept_success',
                ),
            });

            await removeConnectionRequest({
                connectionRequestId: connectionRequest.id,
                shouldShowNotification: false,
            });
        }
    };

    const handleDeclineConnectionRequest = async (
        connectionRequestId: string,
    ) => {
        await removeConnectionRequest({
            connectionRequestId,
            shouldShowNotification: true,
        });
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
