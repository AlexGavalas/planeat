'use client';

import { Alert, Stack, Switch, Text, Title } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useProfile } from '~hooks/use-profile';
import {
    showErrorNotification,
    showSuccessNotification,
} from '~util/notification';

import {
    setProfessionalDiscoverable,
    setProfessionalRole,
} from '../../app/actions';

export const ProfessionalSettings = () => {
    const { t } = useTranslation();
    const { profile } = useProfile();
    const queryClient = useQueryClient();
    const [error, setError] = useState<string | null>(null);
    const isProfessional = profile?.roles.includes('professional') ?? false;

    const refreshProfile = async () => {
        await queryClient.invalidateQueries({ queryKey: ['user'] });
    };

    const roleMutation = useMutation({
        mutationFn: (enabled: boolean) => setProfessionalRole({ enabled }),
        onSuccess: async (result) => {
            if (!result.ok) {
                setError(
                    result.error === 'active_clients'
                        ? t('professional.settings.active_clients_error')
                        : t('notification.error.message'),
                );
                return;
            }

            setError(null);
            await refreshProfile();
            showSuccessNotification({
                message: t('notification.success.message'),
                title: t('notification.success.title'),
            });
        },
    });

    const discoverabilityMutation = useMutation({
        mutationFn: (discoverable: boolean) =>
            setProfessionalDiscoverable({ discoverable }),
        onSuccess: async (result) => {
            if (!result.ok) {
                showErrorNotification({
                    message: t('notification.error.message'),
                    title: t('notification.error.title'),
                });
                return;
            }

            await refreshProfile();
        },
    });

    const isBusy = roleMutation.isPending || discoverabilityMutation.isPending;
    const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        roleMutation.mutate(event.target.checked);
    };
    const handleDiscoverabilityChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        discoverabilityMutation.mutate(event.target.checked);
    };

    return (
        <Stack component="section" gap="sm">
            <div>
                <Title order={4}>{t('professional.settings.title')}</Title>
                <Text c="dimmed" mt="xs" size="sm">
                    {t('professional.settings.description')}
                </Text>
            </div>
            {error && (
                <Alert color="danger" variant="outline">
                    {error}
                </Alert>
            )}
            <Switch
                checked={isProfessional}
                disabled={!profile || isBusy}
                label={t('professional.settings.role_label')}
                onChange={handleRoleChange}
                w="fit-content"
            />
            {isProfessional && (
                <Switch
                    checked={profile?.professional_is_discoverable ?? false}
                    description={t(
                        'professional.settings.discoverable_description',
                    )}
                    disabled={isBusy}
                    label={t('professional.settings.discoverable_label')}
                    onChange={handleDiscoverabilityChange}
                    w="fit-content"
                />
            )}
        </Stack>
    );
};
