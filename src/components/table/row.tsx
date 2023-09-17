import { ActionIcon, Button, Group, Popover, Stack, Text } from '@mantine/core';
import { EditPencil, Trash } from 'iconoir-react';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Item = any;

export type Header = {
    width: string;
    label: string;
    key: string;
    formatValue?: (item: Item) => string;
};

interface RowProps {
    item: Item;
    headers: Header[];
    onDelete: (item: Item) => Promise<void>;
    onEdit: (item: Item) => Promise<void>;
}

export const Row = ({ item, headers, onDelete, onEdit }: RowProps) => {
    const { t } = useTranslation();
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [deleteInProgress, setDeleteInProgress] = useState(false);

    const handleDelete = async () => {
        setDeleteInProgress(true);

        await onDelete(item);

        setDeleteInProgress(false);
        setOpenConfirmation(false);
    };

    return (
        <tr style={{ width: '100%', height: '3rem' }}>
            {headers
                .filter((header) => header.key !== 'actions')
                .map(({ key, width, formatValue }) => (
                    <td style={{ width }} key={key}>
                        {formatValue?.(item) ?? item[key]}
                    </td>
                ))}
            <td style={{ width: '35%' }}>
                <Group spacing="md" position="center">
                    <ActionIcon onClick={() => onEdit(item)} variant="subtle">
                        <EditPencil />
                    </ActionIcon>
                    <Popover
                        shadow="md"
                        withArrow
                        withinPortal
                        trapFocus
                        closeOnEscape
                        closeOnClickOutside
                        opened={openConfirmation}
                        onChange={setOpenConfirmation}
                    >
                        <Popover.Target>
                            <ActionIcon
                                color="red"
                                onClick={() => setOpenConfirmation(true)}
                                variant="subtle"
                            >
                                <Trash />
                            </ActionIcon>
                        </Popover.Target>
                        <Popover.Dropdown>
                            <Stack spacing="md" align="center">
                                <Text>{t('confirmation.generic')}</Text>
                                <Group spacing="md">
                                    <Button
                                        color="red"
                                        size="xs"
                                        variant="outline"
                                        onClick={() => {
                                            setOpenConfirmation(false);
                                        }}
                                    >
                                        {t('confirmation.no')}
                                    </Button>
                                    <Button
                                        size="xs"
                                        onClick={handleDelete}
                                        loading={deleteInProgress}
                                    >
                                        {t('confirmation.yes')}
                                    </Button>
                                </Group>
                            </Stack>
                        </Popover.Dropdown>
                    </Popover>
                </Group>
            </td>
        </tr>
    );
};
