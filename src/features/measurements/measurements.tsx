import { ActionIcon, Box, Center, Group, Stack, Title } from '@mantine/core';
import {
    keepPreviousData,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { Plus } from 'iconoir-react';
import { useTranslation } from 'next-i18next';
import { useCallback, useMemo, useState } from 'react';

import { LoadingOverlay } from '~components/loading-overlay';
import { INITIAL_PAGE, PAGE_SIZE, Table } from '~components/table';
import { useProfile } from '~hooks/use-profile';
import { type Measurement } from '~types/measurement';
import { useOpenContextModal } from '~util/modal';
import { showErrorNotification } from '~util/notification';

export const Measurements = () => {
    const { t } = useTranslation();
    const { profile } = useProfile();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(INITIAL_PAGE);
    const openMeasurementModal = useOpenContextModal('measurement');

    const { data: count = 0, isFetched } = useQuery({
        enabled: Boolean(profile),
        queryFn: async () => {
            const response = await fetch('/api/v1/measurement?count=true');

            const { count } = (await response.json()) as { count?: number };

            return count;
        },
        queryKey: ['measurements-count'],
    });

    const { data: measurements = [], isFetching } = useQuery({
        enabled: isFetched,
        placeholderData: keepPreviousData,
        queryFn: async () => {
            const start = (page - 1) * PAGE_SIZE;
            const end = page * PAGE_SIZE - 1;

            const response = await fetch(
                `/api/v1/measurement?end=${end}&start=${start}`,
            );

            const { data } = (await response.json()) as {
                data?: Measurement[];
            };

            return data ?? [];
        },
        queryKey: ['measurements', page],
    });

    const totalPages = Math.ceil((count || 0) / PAGE_SIZE);
    const isLoading = (!measurements.length && !isFetched) || isFetching;

    const handleNewWeightSave = useCallback(async () => {
        setPage(INITIAL_PAGE);

        await queryClient.invalidateQueries({
            queryKey: ['measurements-count'],
        });

        await queryClient.invalidateQueries({
            queryKey: ['measurements'],
        });
    }, [queryClient]);

    const handleDelete = async (item: Measurement) => {
        const response = await fetch(`/api/v1/measurement?id=${item.id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            showErrorNotification({
                message: `${t('errors.measurement_delete')}. ${t('try_again')}`,
                title: t('notification.error.title'),
            });
        } else {
            await queryClient.invalidateQueries({
                queryKey: ['measurements-count'],
            });

            await queryClient.invalidateQueries({
                queryKey: ['measurements'],
            });
        }
    };

    const handleEdit = useCallback(
        (item: Measurement) => {
            const handleSave = async () => {
                await queryClient.invalidateQueries({
                    queryKey: ['measurements', page],
                });
            };

            openMeasurementModal({
                centered: true,
                innerProps: {
                    initialData: {
                        date: parseISO(item.date),
                        id: item.id,
                        ...(item.fat_percentage && {
                            fat_percentage: item.fat_percentage,
                        }),
                        ...(item.weight && {
                            weight: item.weight,
                        }),
                    },
                    onSave: handleSave,
                },
                size: 'sm',
                title: t('edit_measurement'),
            });
        },
        [openMeasurementModal, page, queryClient, t],
    );

    const handlePageChange = useCallback((page: number) => {
        setPage(page);
    }, []);

    const handleAddMeasurement = useCallback(() => {
        openMeasurementModal({
            centered: true,
            innerProps: {
                onSave: handleNewWeightSave,
            },
            size: 'sm',
            title: t('new_measurement'),
        });
    }, [openMeasurementModal, handleNewWeightSave, t]);

    const headers = useMemo(
        () => [
            {
                formatValue: (item: Measurement) =>
                    format(parseISO(item.date), 'dd/MM/yy'),
                key: 'date',
                label: t('date'),
                width: '25%',
            },
            {
                key: 'weight',
                label: t('weight'),
                width: '20%',
            },
            {
                formatValue: (item: Measurement) =>
                    item.fat_percentage ? `${item.fat_percentage}%` : '-',
                key: 'fat',
                label: t('fat_label'),
                width: '20%',
            },
            {
                key: 'actions',
                label: t('actions'),
                width: '35%',
            },
        ],
        [t],
    );

    return (
        <Stack gap="md">
            <Group justify="space-between">
                <Title order={3}>{t('measurements')}</Title>
                <ActionIcon
                    onClick={handleAddMeasurement}
                    size="lg"
                    title={t('add_measurement')}
                    variant="light"
                >
                    <Plus />
                </ActionIcon>
            </Group>
            <Box style={{ minHeight: 100 }}>
                <LoadingOverlay visible={isLoading} />
                {measurements.length > 0 ? (
                    <Table
                        data={measurements}
                        headers={headers}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        onPageChange={handlePageChange}
                        page={page}
                        totalPages={totalPages}
                    />
                ) : (
                    !isLoading && (
                        <Center style={{ height: 100 }}>
                            <Title order={4}>{t('no_measurements_yet')}</Title>
                        </Center>
                    )
                )}
            </Box>
        </Stack>
    );
};
