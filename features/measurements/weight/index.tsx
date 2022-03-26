import {
    ActionIcon,
    Box,
    Center,
    Group,
    LoadingOverlay,
    Pagination,
    Table,
    Title,
} from '@mantine/core';

import { useModals } from '@mantine/modals';
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import { useUser } from '@supabase/supabase-auth-helpers/react';
import { Plus } from 'iconoir-react';
import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { NewWeightModalContent } from './new-weight-modal-content';
import { Row } from './row';

const PAGE_SIZE = 10;

export const WeightTable = () => {
    const modals = useModals();
    const { user } = useUser();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);

    const { data: count = 0, isFetched } = useQuery(
        ['measurements-count'],
        async () => {
            const { count } = await supabaseClient
                .from('weight-measurements')
                .select('id', { count: 'exact' });

            return (count || 0) / PAGE_SIZE;
        },
        {
            enabled: Boolean(user),
        }
    );

    const { data: measurements = [], isFetching } = useQuery(
        ['measurements', page],
        async () => {
            return supabaseClient
                .from<WeightData>('weight-measurements')
                .select('*')
                .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)
                .order('date', { ascending: false });
        },
        {
            select: ({ data }) => data || [],
            enabled: Boolean(count),
        }
    );

    const onNewWeightSave = () => {
        setPage(1);
        queryClient.invalidateQueries(['measurements']);
    };

    return (
        <>
            <Group position="apart" py={20}>
                <Title order={3}>Μετρήσεις βάρους</Title>
                <ActionIcon
                    title="Add a new measurement"
                    variant="light"
                    size="lg"
                    onClick={() => {
                        if (!user) return;

                        modals.openModal({
                            title: 'New weight',
                            centered: true,
                            size: 'sm',
                            children: (
                                <NewWeightModalContent
                                    userId={user.id}
                                    onSave={onNewWeightSave}
                                />
                            ),
                        });
                    }}
                >
                    <Plus />
                </ActionIcon>
            </Group>
            <Box style={{ position: 'relative', minHeight: 200 }}>
                <LoadingOverlay
                    visible={(!measurements.length && !isFetched) || isFetching}
                />
                {measurements.length > 0 ? (
                    <>
                        <Table highlightOnHover={true}>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th style={{ width: '50%' }}>Weight</th>
                                </tr>
                            </thead>
                            <tbody>
                                {measurements.map((item) => (
                                    <Row
                                        key={item.id}
                                        item={item}
                                        page={page}
                                    />
                                ))}
                            </tbody>
                        </Table>
                        {count > PAGE_SIZE && (
                            <Pagination
                                total={count}
                                position="right"
                                onChange={setPage}
                            />
                        )}
                    </>
                ) : (
                    <Center>
                        <Title order={4}>Δεν έχεις ακόμα καμία μέτρηση</Title>
                    </Center>
                )}
            </Box>
        </>
    );
};
