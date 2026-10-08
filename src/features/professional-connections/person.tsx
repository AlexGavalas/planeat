import { Group, Paper, Text } from '@mantine/core';
import { type ReactNode } from 'react';

import { type ProfessionalSummary } from '~types/professional';

type PersonProps = ProfessionalSummary & Readonly<{ actions: ReactNode }>;

export const Person = ({ actions, email, fullName }: PersonProps) => (
    <Paper withBorder p="md">
        <Group justify="space-between" wrap="wrap">
            <div>
                <Text fw="var(--mantine-font-weight-semibold)">{fullName}</Text>
                <Text c="dimmed" size="sm">
                    {email}
                </Text>
            </div>
            <Group gap="xs">{actions}</Group>
        </Group>
    </Paper>
);
