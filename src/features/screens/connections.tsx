'use client';

import { Container, Stack, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { Card } from '~components/card';
import { FindUsers } from '~features/find-users';
import { ManageConnectionRequests } from '~features/manage-connection-requests';
import { ManageConnections } from '~features/manage-connections';

export function Connections() {
    const { t } = useTranslation();

    return (
        <Container>
            <Stack gap="md">
                <Title order={3}>{t('connections.title')}</Title>
                <Card>
                    <FindUsers />
                </Card>
                <Card>
                    <Title order={3}>
                        {t('connections.manage_connection_requests.title')}
                    </Title>
                    <ManageConnectionRequests />
                </Card>
                <Card>
                    <Title order={3}>
                        {t('connections.manage_connections.title')}
                    </Title>
                    <ManageConnections />
                </Card>
            </Stack>
        </Container>
    );
}
