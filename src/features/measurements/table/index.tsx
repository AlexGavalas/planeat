import {
    ActionIcon,
    Card,
    Center,
    Group,
    Pagination,
    Stack,
    Table,
    Title,
} from '@mantine/core';
import { useModals } from '@mantine/modals';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Plus } from 'iconoir-react';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { LoadingOverlay } from '~components/loading-overlay';
import { MeasurementModal } from '~features/modals/measurement';
import { useProfile } from '~hooks/use-profile';
import { type Database } from '~types/supabase';

import { Row } from './row';

const PAGE_SIZE = 5;

export const MeasurementsTable = () => {
    const { t } = useTranslation();
    const modals = useModals();
    const { profile } = useProfile();
    const queryClient = useQueryClient();
    const supabase = useSupabaseClient<Database>();
    const [page, setPage] = useState(1);

    const { data: count = 0, isFetched } = useQuery(
        ['measurements-count'],
        async () => {
            if (!profile) {
                throw new Error(`User not logged in`);
            }

            const { count } = await supabase
                .from('measurements')
                .select('id', { count: 'exact' })
                .eq('user_id', profile.id);

            return count;
        },
        {
            enabled: Boolean(profile),
        },
    );

    const { data: measurements = [], isFetching } = useQuery(
        ['measurements', page],
        async () => {
            if (!profile) {
                throw new Error(`User not logged in`);
            }

            return supabase
                .from('measurements')
                .select('*')
                .eq('user_id', profile.id)
                .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)
                .order('date', { ascending: false });
        },
        {
            select: ({ data }) => data || [],
            enabled: isFetched,
        },
    );

    const totalPages = Math.ceil((count || 0) / PAGE_SIZE);

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
                    size="lg"
                    onClick={() => {
                        if (!profile) {
                            return;
                        }

                        modals.openModal({
                            title: t('new_measurement'),
                            centered: true,
                            size: 'sm',
                            children: (
                                <MeasurementModal
                                    userId={profile.id}
                                    onSave={onNewWeightSave}
                                />
                            ),
                        });
                    }}
                >
                    <Plus />
                </ActionIcon>
            </Group>
            <Card style={{ minHeight: 100 }}>
                <LoadingOverlay visible={loading} />
                {measurements.length > 0 ? (
                    <Stack spacing="md">
                        <Table highlightOnHover>
                            <thead>
                                <tr>
                                    <th style={{ width: '25%' }}>
                                        {t('date')}
                                    </th>
                                    <th style={{ width: '20%' }}>
                                        {t('weight')}
                                    </th>
                                    <th style={{ width: '20%' }}>
                                        {t('fat_label')}
                                    </th>
                                    <th style={{ width: '35%' }}>
                                        {t('actions')}
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
                        {totalPages > 1 && (
                            <Pagination
                                total={totalPages}
                                position="right"
                                value={page}
                                onChange={setPage}
                                withEdges
                            />
                        )}
                    </Stack>
                ) : (
                    !loading && (
                        <Center style={{ height: 100 }}>
                            <Title order={4}>{t('no_measurements_yet')}</Title>
                        </Center>
                    )
                )}
            </Card>
        </>
    );
};
