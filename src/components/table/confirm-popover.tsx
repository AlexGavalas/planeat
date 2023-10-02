import { Button, Group, Stack, Text } from '@mantine/core';
import { useTranslation } from 'next-i18next';
import { type MouseEventHandler } from 'react';

type ConfirmationPopoverProps = {
    isDeleteInProgress: boolean;
    onToggleConfirmation: () => void;
    onDelete: MouseEventHandler<HTMLButtonElement>;
};

export const ConfirmationPopover = ({
    onDelete,
    isDeleteInProgress,
    onToggleConfirmation,
}: ConfirmationPopoverProps) => {
    const { t } = useTranslation();

    return (
        <Stack align="center" gap="md">
            <Text>{t('confirmation.generic')}</Text>
            <Group gap="md">
                <Button
                    color="red"
                    onClick={onToggleConfirmation}
                    size="xs"
                    variant="outline"
                >
                    {t('confirmation.no')}
                </Button>
                <Button
                    loading={isDeleteInProgress}
                    onClick={onDelete}
                    size="xs"
                >
                    {t('confirmation.yes')}
                </Button>
            </Group>
        </Stack>
    );
};
