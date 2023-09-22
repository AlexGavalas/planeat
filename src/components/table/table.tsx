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

type PageProps = {
    data: Item[];
    headers: Header[];
    totalPages: number;
    onDelete: (item: Item) => Promise<void>;
    onEdit: (item: Item) => Promise<void>;
    onPageChange: (page: number) => void;
};

export const Table = ({
    data,
    headers,
    totalPages,
    onPageChange,
    onDelete,
    onEdit,
}: PageProps) => {
    const [page, setPage] = useState(INITIAL_PAGE);

    const shouldShowPagination = totalPages > 1;

    const handlePageChange = (page: number) => {
        setPage(page);
        onPageChange(page);
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
                            item={item}
                            headers={headers}
                            onDelete={onDelete}
                            onEdit={onEdit}
                        />
                    ))}
                </TableTbody>
            </MantineTable>
            {shouldShowPagination && (
                <Group justify="end">
                    <Pagination
                        total={totalPages}
                        value={page}
                        onChange={handlePageChange}
                        withEdges
                    />
                </Group>
            )}
        </Stack>
    );
};
