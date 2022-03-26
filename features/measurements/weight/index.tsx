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
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { NewWeightModalContent } from './new-weight-modal-content';
import { Row } from './row';

const PAGE_SIZE = 10;

export const WeightTable = () => {
    const { t } = useTranslation();

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
            enabled: isFetched,
        }
    );

    const onNewWeightSave = () => {
        setPage(1);
        queryClient.invalidateQueries(['measurements']);
    };

    return (
        <>
            <Group position="apart" py={20}>
                <Title order={3}>{t('weight_measurements')}</Title>
                <ActionIcon
                    title={t('add_measurement')}
                    variant="light"
                    size="lg"
                    onClick={() => {
                        if (!user) return;

                        modals.openModal({
                            title: t('new_weight'),
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
                                    <th>{t('date')}</th>
                                    <th style={{ width: '50%' }}>
                                        {t('weight')}
                                    </th>
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
                        <Title order={4}>{t('no_measurements_yet')}</Title>
                    </Center>
                )}
            </Box>
        </>
    );
};
