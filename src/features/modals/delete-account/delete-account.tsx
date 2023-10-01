import { Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

import { useProfile } from '~hooks/use-profile';

export const DeleteAccountModal = ({
    closeModal,
}: {
    closeModal: () => void;
}) => {
    const { t } = useTranslation();
    const { user, deleteProfile, isDeleting } = useProfile();
    const [userEmail, setUserEmail] = useState<string>();

    const canDelete = userEmail === user?.email;

    return (
        <Stack gap="md" align="center">
            <TextInput
                label={t(
                    'account_settings.sections.delete_account.modal.label',
                    { email: user?.email },
                )}
                value={userEmail}
                onChange={(value) => {
                    setUserEmail(value.target.value);
                }}
            />
            <Text fw="bold">
                {t('account_settings.sections.delete_account.modal.banner')}
            </Text>
            <Group>
                <Button onClick={closeModal} variant="outline" color="red">
                    {t('account_settings.sections.delete_account.modal.cancel')}
                </Button>
                <Button
                    color="red"
                    disabled={!canDelete}
                    onClick={() => {
                        deleteProfile();
                    }}
                    loading={isDeleting}
                >
                    {t(
                        'account_settings.sections.delete_account.modal.confirm',
                    )}
                </Button>
            </Group>
        </Stack>
    );
};
