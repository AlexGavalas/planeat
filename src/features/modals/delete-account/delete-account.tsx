import { Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { type ContextModalProps } from '@mantine/modals';
import { useTranslation } from 'next-i18next';
import { type ChangeEventHandler, useCallback, useState } from 'react';

import { useProfile } from '~hooks/use-profile';

export const DeleteAccountModal = ({ context, id }: ContextModalProps) => {
    const { t } = useTranslation();
    const { user, deleteProfile, isDeleting } = useProfile();
    const [userEmail, setUserEmail] = useState('');

    const canDelete = userEmail === user?.email;

    const handleEmailChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
        (value) => {
            setUserEmail(value.target.value);
        },
        [],
    );

    const closeModal = useCallback(() => {
        context.closeModal(id);
    }, [context, id]);

    const handleProfileDelete = useCallback(() => {
        deleteProfile();
    }, [deleteProfile]);

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
            <Text fw="bold">
                {t('account_settings.sections.delete_account.modal.banner')}
            </Text>
            <Group gap="md">
                <Button color="red" onClick={closeModal} variant="outline">
                    {t('account_settings.sections.delete_account.modal.cancel')}
                </Button>
                <Button
                    color="red"
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
