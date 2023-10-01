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
import {
    type MouseEventHandler,
    type ReactNode,
    useCallback,
    useState,
} from 'react';

export type Item = Record<string, ReactNode> & {
    id: string | number;
};

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
    const [hasOpenConfirmation, setHasOpenConfirmation] = useState(false);
    const [deleteInProgress, setDeleteInProgress] = useState(false);

    const handleDelete = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(async () => {
        setDeleteInProgress(true);

        await onDelete(item);

        setDeleteInProgress(false);
        setHasOpenConfirmation(false);
    }, [item, onDelete]);

    const handleEdit = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(async () => {
        await onEdit(item);
    }, [item, onEdit]);

    const toggleConfirmation = useCallback(() => {
        setHasOpenConfirmation(true);
    }, []);

    return (
        <TableTr style={{ width: '100%', height: '3rem' }}>
            {headers
                .filter((header) => header.key !== 'actions')
                .map(({ key, width, formatValue }) => (
                    <TableTd key={key} style={{ width }}>
                        {formatValue?.(item) ?? get(key, item)}
                    </TableTd>
                ))}
            <TableTd style={{ width: '35%' }}>
                <Group gap="md" justify="center">
                    <ActionIcon onClick={handleEdit} variant="subtle">
                        <EditPencil />
                    </ActionIcon>
                    <Popover
                        closeOnClickOutside
                        closeOnEscape
                        trapFocus
                        withArrow
                        withinPortal
                        id="delete-confirmation"
                        onChange={setHasOpenConfirmation}
                        opened={hasOpenConfirmation}
                        shadow="md"
                    >
                        <Popover.Target>
                            <ActionIcon
                                color="red"
                                onClick={toggleConfirmation}
                                variant="subtle"
                            >
                                <Trash />
                            </ActionIcon>
                        </Popover.Target>
                        <Popover.Dropdown>
                            <Stack align="center" gap="md">
                                <Text>{t('confirmation.generic')}</Text>
                                <Group gap="md">
                                    <Button
                                        color="red"
                                        onClick={toggleConfirmation}
                                        size="xs"
                                        variant="outline"
                                    >
                                        {t('confirmation.no')}
                                    </Button>
                                    <Button
                                        loading={deleteInProgress}
                                        onClick={handleDelete}
                                        size="xs"
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
