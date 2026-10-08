import { Button, Group, Paper, Text } from '@mantine/core';
import { type MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import { NameAvatar } from '~components/name-avatar';
import {
    type Notification,
    type NotificationWithUser,
} from '~types/notification';

import styles from './connection-request.module.css';

type ConnectionRequestProps = Readonly<{
    connectionRequest: NotificationWithUser;
    onAcceptConnectionRequest: (params: Notification) => Promise<void>;
    onDeclineConnectionRequest: (connectionRequestId: string) => Promise<void>;
}>;

export const ConnectionRequest = ({
    connectionRequest,
    onAcceptConnectionRequest,
    onDeclineConnectionRequest,
}: ConnectionRequestProps) => {
    const { t } = useTranslation();

    const handleAccept = (async () => {
        await onAcceptConnectionRequest(connectionRequest);
    }) satisfies MouseEventHandler<HTMLButtonElement>;

    const handleDecline = (async () => {
        await onDeclineConnectionRequest(connectionRequest.id);
    }) satisfies MouseEventHandler<HTMLButtonElement>;

    return (
        <Paper withBorder p="md" role="listitem">
            <Group className={styles.row} justify="space-between">
                <Group gap="sm" wrap="nowrap">
                    <NameAvatar name={connectionRequest.users.full_name} />
                    <Text fw="var(--mantine-font-weight-semibold)">
                        {connectionRequest.users.full_name}
                    </Text>
                </Group>
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
