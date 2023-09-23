import { ActionIcon, Box, Center, Group, Stack, Title } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { format, parseISO } from 'date-fns';
import { Plus } from 'iconoir-react';
import { useTranslation } from 'next-i18next';
import { useCallback, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { LoadingOverlay } from '~components/loading-overlay';
import { INITIAL_PAGE, PAGE_SIZE, Table } from '~components/table';
import { MeasurementModal } from '~features/modals/measurement';
import { useProfile } from '~hooks/use-profile';
import { type Measurement } from '~types/measurement';

export const Measurements = () => {
    const { t } = useTranslation();
    const modals = useModals();
    const { profile } = useProfile();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(INITIAL_PAGE);

    const { data: count = 0, isFetched } = useQuery(
        ['measurements-count'],
        async () => {
            const response = await fetch('/api/v1/measurement?count=true');

            const { count } = await response.json();

            return count;
        },
        {
            enabled: Boolean(profile),
        },
    );

    const { data: measurements = [], isFetching } = useQuery(
        ['measurements', page],
        async () => {
            const start = (page - 1) * PAGE_SIZE;
            const end = page * PAGE_SIZE - 1;

            const response = await fetch(
                `/api/v1/measurement?end=${end}&start=${start}`,
            );

            const { data } = await response.json();

            return data ?? [];
        },
        {
            keepPreviousData: true,
            enabled: isFetched,
        },
    );

    const totalPages = Math.ceil((count || 0) / PAGE_SIZE);
    const loading = (!measurements.length && !isFetched) || isFetching;

    const onNewWeightSave = useCallback(async () => {
        setPage(INITIAL_PAGE);

        await queryClient.invalidateQueries(['measurements-count']);
        await queryClient.invalidateQueries(['measurements']);
    }, [queryClient]);

    const onDelete = async (item: Measurement) => {
        const response = await fetch(`/api/v1/measurement?id=${item.id}`, {
            method: 'DELETE',
        });

        const { error } = await response.json();

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

    const onEdit = useCallback(
        async (item: Measurement) => {
            const onSave = async () => {
                await queryClient.invalidateQueries(['measurements', page]);
            };

            modals.openModal({
                title: t('edit_measurement'),
                centered: true,
                size: 'sm',
                children: (
                    <MeasurementModal
                        onSave={onSave}
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
                    />
                ),
            });
        },
        [modals, page, queryClient, t],
    );

    const onPageChange = useCallback((page: number) => {
        setPage(page);
    }, []);

    const handleAddMeasurement = useCallback(() => {
        modals.openModal({
            title: t('new_measurement'),
            centered: true,
            size: 'sm',
            children: <MeasurementModal onSave={onNewWeightSave} />,
        });
    }, [modals, onNewWeightSave, t]);

    const headers = useMemo(
        () => [
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
        ],
        [t],
    );

    return (
        <Stack gap="md">
            <Group justify="space-between">
                <Title order={3}>{t('measurements')}</Title>
                <ActionIcon
                    variant="light"
                    title={t('add_measurement')}
                    size="lg"
                    onClick={handleAddMeasurement}
                >
                    <Plus />
                </ActionIcon>
            </Group>
            <Box style={{ minHeight: 100 }}>
                <LoadingOverlay visible={loading} />
                {measurements.length > 0 ? (
                    <Table
                        data={measurements}
                        headers={headers}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        onPageChange={onPageChange}
                        totalPages={totalPages}
                        page={page}
                    />
                ) : (
                    !loading && (
                        <Center style={{ height: 100 }}>
                            <Title order={4}>{t('no_measurements_yet')}</Title>
                        </Center>
                    )
                )}
            </Box>
        </Stack>
    );
};
