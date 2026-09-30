import { Button, Group, Paper, Text } from '@mantine/core';
import { type MouseEventHandler, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { type Notification } from '~types/notification';

import styles from './connection-request.module.css';

type ConnectionRequestProps = Readonly<{
    connectionRequest: Notification;
    onAcceptConnectionRequest: (params: Notification) => Promise<void>;
    onDeclineConnectionRequest: (connectionRequestId: string) => Promise<void>;
}>;

export const ConnectionRequest = ({
    connectionRequest,
    onAcceptConnectionRequest,
    onDeclineConnectionRequest,
}: ConnectionRequestProps) => {
    const { t } = useTranslation();

    const handleAccept = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(async () => {
        await onAcceptConnectionRequest(connectionRequest);
    }, [connectionRequest, onAcceptConnectionRequest]);

    const handleDecline = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(async () => {
        await onDeclineConnectionRequest(connectionRequest.id);
    }, [connectionRequest.id, onDeclineConnectionRequest]);

    return (
        <Paper withBorder p="md" role="listitem">
            <Group className={styles.row} justify="space-between">
                {/* eslint-disable @typescript-eslint/no-unsafe-member-access */}
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-expect-error */}
                <Text fw={600}>{connectionRequest.users.full_name}</Text>
                <Group className={styles.actions} gap="xs" wrap="nowrap">
                    <Button onClick={handleAccept}>
                        {t('connections.manage_connection_requests.accept')}
                    </Button>
                    <Button onClick={handleDecline} variant="outline">
                        {t('connections.manage_connection_requests.decline')}
                    </Button>
                </Group>
            </Group>
        </Paper>
    );
};
