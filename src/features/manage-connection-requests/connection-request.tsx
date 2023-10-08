import { Button, Group, Text } from '@mantine/core';
import { useTranslation } from 'next-i18next';
import { type MouseEventHandler, useCallback } from 'react';

import { type Notification } from '~types/notification';

type ConnectionRequestProps = {
    connectionRequest: Notification;
    onAcceptConnectionRequest: (params: Notification) => Promise<void>;
    onDeclineConnectionRequest: (connectionRequestId: string) => Promise<void>;
};

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
        <Group key={connectionRequest.id} justify="space-between">
            {/* eslint-disable @typescript-eslint/no-unsafe-member-access */}
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-expect-error */}
            <Text>{connectionRequest.users.full_name}</Text>
            <Group gap="xs">
                <Button onClick={handleAccept} size="sm">
                    {t('connections.manage_connection_requests.accept')}
                </Button>
                <Button onClick={handleDecline} size="sm" variant="outline">
                    {t('connections.manage_connection_requests.decline')}
                </Button>
            </Group>
        </Group>
    );
};
