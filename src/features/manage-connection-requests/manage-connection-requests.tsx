import { Button, Group, Stack, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useTranslation } from 'next-i18next';
import { useQuery, useQueryClient } from 'react-query';

import { LoadingOverlay } from '~components/loading-overlay';
import { useProfile } from '~hooks/use-profile';
import { type Notification } from '~types/notification';
import { type Database } from '~types/supabase';

export const ManageConnectionRequests = () => {
    const { t } = useTranslation();
    const { profile } = useProfile();
    const supabase = useSupabaseClient<Database>();
    const queryClient = useQueryClient();

    const {
        data: connectionRequests = [],
        isFetching: isFetchingConnectionRequests,
    } = useQuery(
        ['connection-requests', profile?.id],
        async () => {
            if (!profile) {
                return;
            }

            const { data } = await supabase
                .from('notifications')
                .select('*, users:request_user_id(full_name)')
                .eq('notification_type', 'connection_request')
                .eq('target_user_id', profile.id);

            return data ?? [];
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
        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', connectionRequestId);

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
        }
    };

    const handleAcceptConnectionRequest = async (
        connectionRequest: Notification,
    ) => {
        if (!profile) {
            return;
        }

        const { error } = await supabase.from('connections').insert([
            {
                user_id: connectionRequest.request_user_id,
                connection_user_id: connectionRequest.target_user_id,
            },
            {
                user_id: connectionRequest.target_user_id,
                connection_user_id: connectionRequest.request_user_id,
            },
        ]);

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
