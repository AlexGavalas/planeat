'use client';

import { Container, Stack, Title } from '@mantine/core';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Card } from '~components/card';
import { FindUsers } from '~features/find-users';

import styles from './connections.module.css';

type ConnectionsProps = Readonly<{
    connections: ReactNode;
    professional: ReactNode;
    requests: ReactNode;
}>;

export function Connections({
    connections,
    professional,
    requests,
}: ConnectionsProps) {
    const { t } = useTranslation();

    return (
        <Container className={styles.container}>
            <Stack gap="md">
                <Title order={2}>{t('connections.title')}</Title>
                <Card>{professional}</Card>
                <Card>
                    <FindUsers />
                </Card>
                <Card>
                    <Title order={3}>
                        {t('connections.manage_connection_requests.title')}
                    </Title>
                    {requests}
                </Card>
                <Card>
                    <Title order={3}>
                        {t('connections.manage_connections.title')}
                    </Title>
                    {connections}
                </Card>
            </Stack>
        </Container>
    );
}
