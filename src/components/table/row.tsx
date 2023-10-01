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

export type Header<T> = {
    width: string;
    label: string;
    key: string;
    formatValue?: (item: T) => string;
};

type RowProps<T> = {
    item: T;
    headers: Header<T>[];
    onDelete: (item: T) => Promise<void> | void;
    onEdit: (item: T) => Promise<void> | void;
};

export const Row = <T extends Item>({
    item,
    headers,
    onDelete,
    onEdit,
}: RowProps<T>) => {
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
