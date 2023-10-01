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

            const { data } = (await response.json()) as {
                data?: Notification[];
            };

            return data ?? [];
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

        return response;
    };

    const handleAcceptConnectionRequest = async (
        connectionRequest: Notification,
    ) => {
        const response = await fetch('/api/v1/connection', {
            body: JSON.stringify({
                connectionUserId: connectionRequest.request_user_id,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        });

        if (!response.ok) {
            showErrorNotification({
                message: t(
                    'connections.manage_connection_requests.accept_error',
                ),
                title: t('error'),
            });
        } else {
            showSuccessNotification({
                message: t(
                    'connections.manage_connection_requests.accept_success',
                ),
                title: t('success'),
            });

            const removeConnectionRes = await removeConnectionRequest(
                connectionRequest.id,
            );

            if (!removeConnectionRes.ok) {
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
        const response = await removeConnectionRequest(connectionRequestId);

        if (!response.ok) {
            showErrorNotification({
                message: t(
                    'connections.manage_connection_requests.decline_error',
                ),
                title: t('error'),
            });
        } else {
            showSuccessNotification({
                message: t(
                    'connections.manage_connection_requests.decline_success',
                ),
                title: t('success'),
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
                            {/* eslint-disable @typescript-eslint/no-unsafe-member-access */}
                            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                            {/* @ts-expect-error */}
                            <Text>{connectionRequest.users.full_name}</Text>
                            <Group gap="xs">
                                <Button
                                    // eslint-disable-next-line @typescript-eslint/no-misused-promises, react/jsx-handler-names -- async event handler
                                    onClick={async () => {
                                        await handleAcceptConnectionRequest(
                                            connectionRequest,
                                        );
                                    }}
                                    size="sm"
                                >
                                    {t(
                                        'connections.manage_connection_requests.accept',
                                    )}
                                </Button>
                                <Button
                                    // eslint-disable-next-line @typescript-eslint/no-misused-promises, react/jsx-handler-names -- async event handler
                                    onClick={async () => {
                                        await handleDeclineConnectionRequest(
                                            connectionRequest.id,
                                        );
                                    }}
                                    size="sm"
                                    variant="outline"
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
