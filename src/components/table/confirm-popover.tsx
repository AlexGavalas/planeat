import { Button, Group, Stack, Text } from '@mantine/core';
import { type MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

type ConfirmationPopoverProps = Readonly<{
    isDeleteInProgress: boolean;
    onToggleConfirmation: () => void;
    onDelete: MouseEventHandler<HTMLButtonElement>;
}>;

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
                    color="danger"
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
