import { Table as MantineTable, Pagination, Stack } from '@mantine/core';
import { useState } from 'react';

import { type Header, type Item, Row } from './row';

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
        <Stack spacing="md">
            <MantineTable highlightOnHover>
                <thead>
                    <tr>
                        {headers.map(({ label, width }) => (
                            <th style={{ width }} key={label}>
                                {label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <Row
                            key={item.id}
                            item={item}
                            headers={headers}
                            onDelete={onDelete}
                            onEdit={onEdit}
                        />
                    ))}
                </tbody>
            </MantineTable>
            {shouldShowPagination && (
                <Pagination
                    total={totalPages}
                    position="right"
                    value={page}
                    onChange={handlePageChange}
                    withEdges
                />
            )}
        </Stack>
    );
};
