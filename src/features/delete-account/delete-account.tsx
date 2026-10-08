import { Button, Stack, Text, Title } from '@mantine/core';
import { type MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import { SettingsActions } from '~features/settings-actions';
import { useOpenContextModal } from '~util/modal';

export const DeleteAccount = () => {
    const { t } = useTranslation();
    const openDeleteAccountModal = useOpenContextModal('delete-account');

    const handleOpenDeleteAccountModal = (() => {
        openDeleteAccountModal({
            centered: true,
            innerProps: {},
            title: t('account_settings.sections.delete_account.title'),
        });
    }) satisfies MouseEventHandler<HTMLButtonElement>;

    return (
        <Stack align="start" gap="md">
            <div>
                <Title order={3}>
                    {t('account_settings.sections.delete_account.title')}
                </Title>
                <Text c="dimmed" mt="xs" size="sm">
                    {t('account_settings.sections.delete_account.description')}
                </Text>
            </div>
            <SettingsActions>
                <Button color="danger" onClick={handleOpenDeleteAccountModal}>
                    {t('account_settings.sections.delete_account.button.label')}
                </Button>
            </SettingsActions>
        </Stack>
    );
};
