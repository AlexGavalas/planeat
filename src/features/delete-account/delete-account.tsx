import { Button, Stack, Title } from '@mantine/core';
import { useTranslation } from 'next-i18next';
import { type MouseEventHandler, useCallback } from 'react';

import { useOpenContextModal } from '~util/modal';

export const DeleteAccount = () => {
    const { t } = useTranslation();
    const openDeleteAccountModal = useOpenContextModal('delete-account');

    const handleOpenDeleteAccountModal = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(() => {
        openDeleteAccountModal({
            centered: true,
            innerProps: {},
            title: t('account_settings.sections.delete_account.title'),
        });
    }, [openDeleteAccountModal, t]);

    return (
        <Stack align="start" gap="md">
            <Title order={3}>
                {t('account_settings.sections.delete_account.title')}
            </Title>
            <Button color="red" onClick={handleOpenDeleteAccountModal}>
                {t('account_settings.sections.delete_account.button.label')}
            </Button>
        </Stack>
    );
};
