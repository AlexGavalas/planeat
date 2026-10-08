import { Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { type ContextModalProps } from '@mantine/modals';
import { type ChangeEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useProfile } from '~hooks/use-profile';

export const DeleteAccountModal = ({ context, id }: ContextModalProps) => {
    const { t } = useTranslation();
    const { user, deleteProfile, isDeleting } = useProfile();
    const [userEmail, setUserEmail] = useState('');

    const canDelete = userEmail === user?.email;

    const handleEmailChange = ((value) => {
        setUserEmail(value.target.value);
    }) satisfies ChangeEventHandler<HTMLInputElement>;

    const closeModal = () => {
        context.closeModal(id);
    };

    const handleProfileDelete = () => {
        deleteProfile();
    };

    return (
        <Stack align="center" gap="md">
            <TextInput
                label={t(
                    'account_settings.sections.delete_account.modal.label',
                    { email: user?.email },
                )}
                onChange={handleEmailChange}
                value={userEmail}
            />

            <Text fw="var(--mantine-font-weight-bold)">
                {t('account_settings.sections.delete_account.modal.banner')}
            </Text>
            <Group gap="md">
                <Button color="danger" onClick={closeModal} variant="outline">
                    {t('account_settings.sections.delete_account.modal.cancel')}
                </Button>
                <Button
                    color="danger"
                    disabled={!canDelete}
                    loading={isDeleting}
                    onClick={handleProfileDelete}
                >
                    {t(
                        'account_settings.sections.delete_account.modal.confirm',
                    )}
                </Button>
            </Group>
        </Stack>
    );
};
