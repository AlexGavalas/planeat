import {
    ActionIcon,
    Button,
    Group,
    Popover,
    Stack,
    TableTd,
    TableTr,
    Text,
} from '@mantine/core';
import { EditPencil, Trash } from 'iconoir-react';
import get from 'lodash/fp/get';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Item = Record<string, any> & { id: string | number };

export type Header<ItemType> = {
    width: string;
    label: string;
    key: string;
    formatValue?: (item: ItemType) => string;
};

type RowProps<ItemType> = {
    item: ItemType;
    headers: Header<ItemType>[];
    onDelete: (item: ItemType) => Promise<void> | void;
    onEdit: (item: ItemType) => Promise<void> | void;
};

export const Row = <ItemType extends Item>({
    item,
    headers,
    onDelete,
    onEdit,
}: RowProps<ItemType>) => {
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
        <TableTr style={{ width: '100%', height: '3rem' }}>
            {headers
                .filter((header) => header.key !== 'actions')
                .map(({ key, width, formatValue }) => (
                    <TableTd style={{ width }} key={key}>
                        {formatValue?.(item) ?? get(key, item)}
                    </TableTd>
                ))}
            <TableTd style={{ width: '35%' }}>
                <Group gap="md" justify="center">
                    <ActionIcon
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises -- async event handler
                        onClick={async () => {
                            await onEdit(item);
                        }}
                        variant="subtle"
                    >
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
                        id="delete-confirmation"
                    >
                        <Popover.Target>
                            <ActionIcon
                                color="red"
                                onClick={() => {
                                    setOpenConfirmation(true);
                                }}
                                variant="subtle"
                            >
                                <Trash />
                            </ActionIcon>
                        </Popover.Target>
                        <Popover.Dropdown>
                            <Stack gap="md" align="center">
                                <Text>{t('confirmation.generic')}</Text>
                                <Group gap="md">
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
                                        // eslint-disable-next-line @typescript-eslint/no-misused-promises -- async event handler
                                        onClick={async () => {
                                            await handleDelete();
                                        }}
                                        loading={deleteInProgress}
                                    >
                                        {t('confirmation.yes')}
                                    </Button>
                                </Group>
                            </Stack>
                        </Popover.Dropdown>
                    </Popover>
                </Group>
            </TableTd>
        </TableTr>
    );
};
