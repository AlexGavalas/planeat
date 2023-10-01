import {
    Group,
    Table as MantineTable,
    Pagination,
    Stack,
    TableTbody,
    TableTh,
    TableThead,
    TableTr,
} from '@mantine/core';
import { useState } from 'react';

import { type Header, type Item, Row } from './row';
import styles from './table.module.css';

export const INITIAL_PAGE = 1;
export const PAGE_SIZE = 5;

export type TableProps<ItemType> = {
    data: ItemType[];
    headers: Header<ItemType>[];
    totalPages: number;
    page: number;
    onDelete: (item: ItemType) => Promise<void> | void;
    onEdit: (item: ItemType) => Promise<void> | void;
    onPageChange?: (page: number) => void;
};

export const Table = <ItemType extends Item>({
    data,
    headers,
    totalPages,
    onPageChange,
    onDelete,
    onEdit,
    page: initialPage,
}: TableProps<ItemType>) => {
    const [page, setPage] = useState(initialPage);

    const shouldShowPagination = totalPages > 1;

    const handlePageChange = (page: number) => {
        setPage(page);
        onPageChange?.(page);
    };

    return (
        <Stack gap="md">
            <MantineTable className={styles.table}>
                <TableThead>
                    <TableTr>
                        {headers.map(({ key, label, width }) => (
                            <TableTh
                                key={label}
                                style={{
                                    width,
                                    textAlign:
                                        key === 'actions' ? 'center' : 'left',
                                }}
                            >
                                {label}
                            </TableTh>
                        ))}
                    </TableTr>
                </TableThead>
                <TableTbody>
                    {data.map((item) => (
                        <Row
                            key={item.id}
                            headers={headers}
                            item={item}
                            onDelete={onDelete}
                            onEdit={onEdit}
                        />
                    ))}
                </TableTbody>
            </MantineTable>
            {shouldShowPagination && (
                <Group justify="end">
                    <Pagination
                        withEdges
                        onChange={handlePageChange}
                        total={totalPages}
                        value={page}
                    />
                </Group>
            )}
        </Stack>
    );
};
