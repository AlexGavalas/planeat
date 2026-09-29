import {
    ActionIcon,
    Button,
    Group,
    Paper,
    Popover,
    Stack,
    TableTd,
    TableTr,
    Text,
} from '@mantine/core';
import { EditPencil, Trash } from 'iconoir-react';
import get from 'lodash/fp/get';
import {
    type MouseEventHandler,
    type ReactNode,
    useCallback,
    useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { ConfirmationPopover } from './confirm-popover';
import styles from './table.module.css';

export type Item = Record<string, ReactNode> & {
    id: string | number;
};

export type Header<ItemType> = {
    width: string;
    label: string;
    key: string;
    formatValue?: (item: ItemType) => string;
};

type RowProps<ItemType> = Readonly<{
    item: ItemType;
    headers: Header<ItemType>[];
    onDelete: (item: ItemType) => Promise<void> | void;
    onEdit: (item: ItemType) => Promise<void> | void;
}>;

type RowActionsProps<ItemType> = Readonly<
    RowProps<ItemType> & {
        isMobile?: boolean;
    }
>;

const RowActions = <ItemType extends Item>({
    item,
    isMobile = false,
    onDelete,
    onEdit,
}: RowActionsProps<ItemType>) => {
    const { t } = useTranslation();
    const [hasOpenConfirmation, setHasOpenConfirmation] = useState(false);
    const [isDeleteInProgress, setIsDeleteInProgress] = useState(false);

    const handleDelete = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(async () => {
        setIsDeleteInProgress(true);
        await onDelete(item);
        setIsDeleteInProgress(false);
        setHasOpenConfirmation(false);
    }, [item, onDelete]);

    const handleEdit = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(async () => {
        await onEdit(item);
    }, [item, onEdit]);

    const handleOpenConfirmation = useCallback(() => {
        setHasOpenConfirmation(true);
    }, []);
    const handleCloseConfirmation = useCallback(() => {
        setHasOpenConfirmation(false);
    }, []);

    const editControl = isMobile ? (
        <Button
            fullWidth
            leftSection={<EditPencil />}
            onClick={handleEdit}
            variant="outline"
        >
            {t('generic.actions.edit')}
        </Button>
    ) : (
        <ActionIcon
            aria-label={t('generic.actions.edit')}
            onClick={handleEdit}
            variant="outline"
        >
            <EditPencil />
        </ActionIcon>
    );

    const deleteControl = isMobile ? (
        <Button
            fullWidth
            color="red"
            leftSection={<Trash />}
            onClick={handleOpenConfirmation}
            variant="outline"
        >
            {t('generic.actions.delete')}
        </Button>
    ) : (
        <ActionIcon
            aria-label={t('generic.actions.delete')}
            color="red"
            onClick={handleOpenConfirmation}
            variant="outline"
        >
            <Trash />
        </ActionIcon>
    );

    return (
        <Group gap="md" grow={isMobile} justify="center" wrap="nowrap">
            {editControl}
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
                <Popover.Target>{deleteControl}</Popover.Target>
                <Popover.Dropdown>
                    <ConfirmationPopover
                        isDeleteInProgress={isDeleteInProgress}
                        onDelete={handleDelete}
                        onToggleConfirmation={handleCloseConfirmation}
                    />
                </Popover.Dropdown>
            </Popover>
        </Group>
    );
};

export const Row = <ItemType extends Item>({
    item,
    headers,
    onDelete,
    onEdit,
}: RowProps<ItemType>) => {
    return (
        <TableTr style={{ height: '3rem', width: '100%' }}>
            {headers
                .filter((header) => header.key !== 'actions')
                .map(({ key, width, formatValue }) => (
                    <TableTd key={key} style={{ width }}>
                        {formatValue?.(item) ?? get(key, item)}
                    </TableTd>
                ))}
            <TableTd style={{ width: '35%' }}>
                <RowActions
                    headers={headers}
                    item={item}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            </TableTd>
        </TableTr>
    );
};

export const MobileRow = <ItemType extends Item>({
    item,
    headers,
    onDelete,
    onEdit,
}: RowProps<ItemType>) => (
    <Paper withBorder className={styles.mobileCard} p="md" role="listitem">
        <Stack gap="md">
            {headers
                .filter((header) => header.key !== 'actions')
                .map(({ formatValue, key, label }) => (
                    <div key={key}>
                        <Text c="dimmed" fw={700} size="xs">
                            {label}
                        </Text>
                        <Text>{formatValue?.(item) ?? get(key, item)}</Text>
                    </div>
                ))}
            <RowActions
                isMobile
                headers={headers}
                item={item}
                onDelete={onDelete}
                onEdit={onEdit}
            />
        </Stack>
    </Paper>
);
