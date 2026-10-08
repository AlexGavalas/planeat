'use client';

import {
    Alert,
    Button,
    Divider,
    Group,
    Paper,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LoadingOverlay } from '~components/loading-overlay';
import { useProfile } from '~hooks/use-profile';
import type {
    ProfessionalClientSummary,
    ProfessionalInvitation,
    ProfessionalSummary,
} from '~types/professional';

import {
    acceptProfessionalInvitation,
    inviteProfessional,
    removeProfessionalRelationship,
} from '../../app/actions';

type ConnectionState = {
    currentProfessional: ProfessionalClientSummary | null;
    incomingInvitations: ProfessionalInvitation[];
    outgoingInvitations: ProfessionalInvitation[];
};

const Person = ({
    actions,
    email,
    fullName,
}: ProfessionalSummary & Readonly<{ actions: React.ReactNode }>) => (
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

    const pendingProfessionalIds = new Set(
        state?.outgoingInvitations.map(({ id }) => id) ?? [],
    );
    const currentProfessional = state?.currentProfessional;

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
            <Stack gap="sm">
                <Title order={4}>
                    {t('professional.connections.current_title')}
                </Title>
                {currentProfessional ? (
                    <Person
                        {...currentProfessional}
                        actions={
                            <Button
                                color="danger"
                                onClick={() => {
                                    void run(() =>
                                        removeProfessionalRelationship({
                                            relationshipId:
                                                currentProfessional.relationshipId,
                                        }),
                                    );
                                }}
                                variant="outline"
                            >
                                {t('professional.connections.stop_client')}
                            </Button>
                        }
                    />
                ) : (
                    <Text>{t('professional.connections.no_current')}</Text>
                )}
            </Stack>
            {!state?.currentProfessional && (
                <Stack gap="sm">
                    <Title order={4}>
                        {t('professional.connections.find_title')}
                    </Title>
                    <TextInput
                        label={t('professional.connections.search_label')}
                        loading={isSearching}
                        onChange={(event) => {
                            setSearch(event.target.value);
                        }}
                        placeholder={t(
                            'professional.connections.search_placeholder',
                        )}
                        value={search}
                    />
                    {professionals.map((professional) => {
                        const isPending = pendingProfessionalIds.has(
                            professional.id,
                        );
                        return (
                            <Person
                                key={professional.id}
                                {...professional}
                                actions={
                                    <Button
                                        disabled={isPending}
                                        onClick={() => {
                                            void run(() =>
                                                inviteProfessional({
                                                    professionalUserId:
                                                        professional.id,
                                                }),
                                            );
                                        }}
                                    >
                                        {t(
                                            isPending
                                                ? 'professional.connections.pending'
                                                : 'professional.connections.invite',
                                        )}
                                    </Button>
                                }
                            />
                        );
                    })}
                </Stack>
            )}
            {(state?.outgoingInvitations.length ?? 0) > 0 && (
                <Stack gap="sm">
                    <Title order={4}>
                        {t('professional.connections.outgoing_title')}
                    </Title>
                    {state?.outgoingInvitations.map((invitation) => (
                        <Person
                            key={invitation.relationshipId}
                            {...invitation}
                            actions={
                                <Button
                                    onClick={() => {
                                        void run(() =>
                                            removeProfessionalRelationship({
                                                relationshipId:
                                                    invitation.relationshipId,
                                            }),
                                        );
                                    }}
                                    variant="outline"
                                >
                                    {t('generic.actions.cancel')}
                                </Button>
                            }
                        />
                    ))}
                </Stack>
            )}
            {isProfessional && (
                <>
                    <Divider />
                    <Stack gap="sm">
                        <Title order={4}>
                            {t('professional.connections.incoming_title')}
                        </Title>
                        {!state?.incomingInvitations.length && (
                            <Text>
                                {t('professional.connections.no_incoming')}
                            </Text>
                        )}
                        {state?.incomingInvitations.map((invitation) => (
                            <Person
                                key={invitation.relationshipId}
                                {...invitation}
                                actions={
                                    <>
                                        <Button
                                            onClick={() => {
                                                void run(() =>
                                                    acceptProfessionalInvitation(
                                                        {
                                                            relationshipId:
                                                                invitation.relationshipId,
                                                        },
                                                    ),
                                                );
                                            }}
                                        >
                                            {t('generic.actions.accept')}
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                void run(() =>
                                                    removeProfessionalRelationship(
                                                        {
                                                            relationshipId:
                                                                invitation.relationshipId,
                                                        },
                                                    ),
                                                );
                                            }}
                                            variant="outline"
                                        >
                                            {t('generic.actions.decline')}
                                        </Button>
                                    </>
                                }
                            />
                        ))}
                    </Stack>
                </>
            )}
        </Stack>
    );
};
