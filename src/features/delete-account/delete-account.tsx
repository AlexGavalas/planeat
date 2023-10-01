import { Button, Stack, Title } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { useTranslation } from 'next-i18next';

import { DeleteAccountModal } from '~features/modals/delete-account';

export const DeleteAccount = () => {
    const { t } = useTranslation();
    const modals = useModals();

    const openDeleteAccountModal = () => {
        const closeModal = () => {
            modals.closeModal(modalId);
        };

        const modalId = modals.openModal({
            title: t('account_settings.sections.delete_account.title'),
            centered: true,
            children: <DeleteAccountModal onCancel={closeModal} />,
        });
    };

    return (
        <Stack align="start" gap="md">
            <Title order={3}>
                {t('account_settings.sections.delete_account.title')}
            </Title>
            <Button color="red" onClick={openDeleteAccountModal}>
                {t('account_settings.sections.delete_account.button.label')}
            </Button>
        </Stack>
    );
};
