'use client';

import { Alert, Stack, Text, Title } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { type ChangeEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LoadingOverlay } from '~components/loading-overlay';
import { useProfile } from '~hooks/use-profile';
import { type ProfessionalSummary } from '~types/professional';

import {
    ConnectionSections,
    type ConnectionState,
} from './connection-sections';

export const ProfessionalConnections = () => {
    const { t } = useTranslation();
    const { profile } = useProfile();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebouncedValue(search, 350);
    const [error, setError] = useState<string | null>(null);
    const isProfessional = profile?.roles.includes('professional') ?? false;

    const { data: state, isFetching } = useQuery({
        queryFn: async () => {
            const response = await fetch(
                '/api/v1/professional?type=connections',
            );
            if (!response.ok) {
                throw new Error('Could not load professional connections');
            }
            const result = (await response.json()) as { data: ConnectionState };
            return result.data;
        },
        queryKey: ['professional-connections', profile?.id],
    });

    const { data: professionals = [], isFetching: isSearching } = useQuery({
        enabled: debouncedSearch.trim().length > 0,
        queryFn: async () => {
            const query = new URLSearchParams({
                q: debouncedSearch,
                type: 'search',
            });
            const response = await fetch(`/api/v1/professional?${query}`);
            const result = (await response.json()) as {
                data?: ProfessionalSummary[];
            };
            return result.data ?? [];
        },
        queryKey: ['professional-search', debouncedSearch],
    });

    const refresh = async () => {
        setError(null);
        await queryClient.invalidateQueries({
            queryKey: ['professional-connections', profile?.id],
        });
    };

    const run = async (
        action: () => Promise<{ error?: string; ok: boolean }>,
    ) => {
        const result = await action();
        if (!result.ok) {
            setError(
                result.error === 'capacity_reached'
                    ? t('professional.connections.capacity_error')
                    : t('professional.connections.action_error'),
            );
            return;
        }
        await refresh();
    };

    const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (
        event,
    ) => {
        setSearch(event.target.value);
    };

    return (
        <Stack gap="lg">
            <LoadingOverlay visible={isFetching} />
            <div>
                <Title order={3}>{t('professional.connections.title')}</Title>
                <Text c="dimmed" mt="xs" size="sm">
                    {t('professional.connections.description')}
                </Text>
            </div>
            {error && (
                <Alert color="danger" variant="outline">
                    {error}
                </Alert>
            )}
            <ConnectionSections
                isProfessional={isProfessional}
                isSearching={isSearching}
                onSearchChange={handleSearchChange}
                professionals={professionals}
                run={run}
                search={search}
                state={state}
            />
        </Stack>
    );
};
