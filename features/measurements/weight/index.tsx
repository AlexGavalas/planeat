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

import { NewMeasurementModalContent } from './new-measurement-modal-content';
import { Row } from './row';

const PAGE_SIZE = 10;

export const MeasurementsTable = () => {
    const { t } = useTranslation();

    const modals = useModals();
    const { user } = useUser();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);

    const { data: count = 0, isFetched } = useQuery(
        ['measurements-count'],
        async () => {
            if (!user) throw new Error(`User not logged in`);

            const { count } = await supabaseClient
                .from<Measurement>('measurements')
                .select('id', { count: 'exact' })
                .eq('user_id', user.id);

            return (count || 0) / PAGE_SIZE;
        },
        {
            enabled: Boolean(user),
        }
    );

    const { data: measurements = [], isFetching } = useQuery(
        ['measurements', page],
        async () => {
            if (!user) throw new Error(`User not logged in`);

            return supabaseClient
                .from<Measurement>('measurements')
                .select('*')
                .eq('user_id', user.id)
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

    const loading = (!measurements.length && !isFetched) || isFetching;

    return (
        <>
            <Group position="apart" py={20}>
                <Title order={3}>{t('measurements')}</Title>
                <ActionIcon
                    title={t('add_measurement')}
                    variant="light"
                    size="lg"
                    onClick={() => {
                        if (!user) return;

                        modals.openModal({
                            title: t('new_measurement'),
                            centered: true,
                            size: 'sm',
                            children: (
                                <NewMeasurementModalContent
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
                <LoadingOverlay visible={loading} />
                {measurements.length > 0 ? (
                    <>
                        <Table highlightOnHover={true}>
                            <thead>
                                <tr>
                                    <th style={{ width: '33%' }}>
                                        {t('date')}
                                    </th>
                                    <th style={{ width: '33%' }}>
                                        {t('weight')}
                                    </th>
                                    <th style={{ width: '33%' }}>
                                        {t('fat_label')}
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
                    !loading && (
                        <Center>
                            <Title order={4}>{t('no_measurements_yet')}</Title>
                        </Center>
                    )
                )}
            </Box>
        </>
    );
};
