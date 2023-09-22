import { ActionIcon, Center, Group, Stack, Title } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { format, parseISO } from 'date-fns';
import { Plus } from 'iconoir-react';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { LoadingOverlay } from '~components/loading-overlay';
import { INITIAL_PAGE, PAGE_SIZE, Table } from '~components/table';
import { MeasurementModal } from '~features/modals/measurement';
import { useProfile } from '~hooks/use-profile';
import { type Measurement } from '~types/measurement';
import { type Database } from '~types/supabase';

export const Measurements = () => {
    const { t } = useTranslation();
    const modals = useModals();
    const { profile } = useProfile();
    const queryClient = useQueryClient();
    const supabase = useSupabaseClient<Database>();
    const [page, setPage] = useState(INITIAL_PAGE);

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

            const { data } = await supabase
                .from('measurements')
                .select('*')
                .eq('user_id', profile.id)
                .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)
                .order('date', { ascending: false });

            return data ?? [];
        },
        {
            keepPreviousData: true,
            enabled: isFetched,
        },
    );

    const totalPages = Math.ceil((count || 0) / PAGE_SIZE);

    const onNewWeightSave = async () => {
        setPage(INITIAL_PAGE);

        await queryClient.invalidateQueries(['measurements-count']);
        await queryClient.invalidateQueries(['measurements']);
    };

    const loading = (!measurements.length && !isFetched) || isFetching;

    const headers = [
        {
            label: t('date'),
            width: '25%',
            key: 'date',
            formatValue: (item: Measurement) =>
                format(parseISO(item.date), 'dd/MM/yy'),
        },
        {
            label: t('weight'),
            width: '20%',
            key: 'weight',
        },
        {
            label: t('fat_label'),
            width: '20%',
            key: 'fat',
            formatValue: (item: Measurement) =>
                item.fat_percentage ? `${item.fat_percentage}%` : '-',
        },
        {
            label: t('actions'),
            width: '35%',
            key: 'actions',
        },
    ];

    const onDelete = async (item: Measurement) => {
        const { error } = await supabase
            .from('measurements')
            .delete()
            .eq('id', item.id);

        if (error) {
            showNotification({
                title: t('error'),
                message: `${t('errors.measurement_delete')}. ${t('try_again')}`,
                color: 'red',
            });
        } else {
            await queryClient.invalidateQueries(['measurements-count']);
            await queryClient.invalidateQueries(['measurements']);
        }
    };

    const onEdit = async (item: Measurement) => {
        if (!profile) {
            return;
        }

        const onSave = async () => {
            await queryClient.invalidateQueries(['measurements', page]);
        };

        modals.openModal({
            title: t('edit_measurement'),
            centered: true,
            size: 'sm',
            children: (
                <MeasurementModal
                    userId={profile.id}
                    initialData={{
                        id: item.id,
                        date: parseISO(item.date),
                        ...(item.fat_percentage && {
                            fat_percentage: item.fat_percentage,
                        }),
                        ...(item.weight && {
                            weight: item.weight,
                        }),
                    }}
                    onSave={onSave}
                />
            ),
        });
    };

    const onPageChange = (page: number) => {
        setPage(page);
    };

    return (
        <Stack gap="md">
            <Group justify="space-between">
                <Title order={3}>{t('measurements')}</Title>
                <ActionIcon
                    variant="light"
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
            <div style={{ minHeight: 100 }}>
                <LoadingOverlay visible={loading} />
                {measurements.length > 0 ? (
                    <Table
                        data={measurements}
                        headers={headers}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        onPageChange={onPageChange}
                        totalPages={totalPages}
                    />
                ) : (
                    !loading && (
                        <Center style={{ height: 100 }}>
                            <Title order={4}>{t('no_measurements_yet')}</Title>
                        </Center>
                    )
                )}
            </div>
        </Stack>
    );
};
