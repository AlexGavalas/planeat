import { Button, Group, Stack, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useTranslation } from 'next-i18next';
import { useQuery, useQueryClient } from 'react-query';

import { LoadingOverlay } from '~components/loading-overlay';
import { useProfile } from '~hooks/use-profile';
import { type Connection } from '~types/connection';
import { type Database } from '~types/supabase';

export const ManageConnections = () => {
    const { t } = useTranslation();
    const { profile } = useProfile();
    const supabase = useSupabaseClient<Database>();
    const queryClient = useQueryClient();

    const { data: connections = [], isFetching: isFetchingConnections } =
        useQuery(
            ['connections', profile?.id],
            async () => {
                if (!profile) {
                    return;
                }

                const { data } = await supabase
                    .from('connections')
                    .select('*, users:connection_user_id(full_name)')
                    .eq('user_id', profile.id);

                return data ?? [];
            },
            {
                enabled: Boolean(profile),
            },
        );

    const removeConnection = async (connection: Connection) => {
        const { error: currentUserError } = await supabase
            .from('connections')
            .delete()
            .eq('id', connection.id);

        const { error: connectionUserError } = await supabase
            .from('connections')
            .delete()
            .eq('connection_user_id', connection.user_id)
            .eq('user_id', connection.connection_user_id);

        if (currentUserError || connectionUserError) {
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
