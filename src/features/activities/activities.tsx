import { ActionIcon, Box, Center, Group, Stack, Title } from '@mantine/core';
import { format, parseISO } from 'date-fns';
import { Plus } from 'iconoir-react';
import { useTranslation } from 'next-i18next';
import { useCallback, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { LoadingOverlay } from '~components/loading-overlay';
import { INITIAL_PAGE, PAGE_SIZE, Table } from '~components/table';
import { useProfile } from '~hooks/use-profile';
import { type Activity } from '~types/activity';
import { useOpenContextModal } from '~util/modal';
import { showErrorNotification } from '~util/notification';

export const Activities = () => {
    const { t } = useTranslation();
    const openNewActivityModal = useOpenContextModal('activity');
    const { profile } = useProfile();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(INITIAL_PAGE);

    const { data: count = 0, isFetched: isCountFetched } = useQuery(
        ['activities-count'],
        async () => {
            const response = await fetch('/api/v1/activity?count=true');

            const { count } = (await response.json()) as { count?: number };

            return count;
        },
        {
            enabled: Boolean(profile),
        },
    );

    const { data: activities = [], isFetching } = useQuery(
        ['activities', page],
        async () => {
            const start = (page - 1) * PAGE_SIZE;
            const end = page * PAGE_SIZE - 1;

            const response = await fetch(
                `/api/v1/activity?end=${end}&start=${start}`,
            );

            const { data } = (await response.json()) as { data?: Activity[] };

            return data ?? [];
        },
        {
            enabled: isCountFetched,
        },
    );

    const totalPages = Math.ceil((count || 0) / PAGE_SIZE);
    const isLoading = (!activities.length && !isCountFetched) || isFetching;

    const onNewActivitySave = useCallback(async () => {
        setPage(INITIAL_PAGE);

        await queryClient.invalidateQueries(['activities-count']);
        await queryClient.invalidateQueries(['activities']);
    }, [queryClient]);

    const headers = useMemo(
        () => [
            {
                formatValue: (item: Activity) =>
                    format(parseISO(item.date), 'dd/MM/yy'),
                key: 'date',
                label: t('date'),
                width: '25%',
            },
            {
                key: 'activity',
                label: t('activity.label'),
                width: '40%',
            },
            {
                key: 'actions',
                label: t('actions'),
                width: '35%',
            },
        ],
        [t],
    );

    const onDelete = async (item: Activity) => {
        const response = await fetch(`/api/v1/activity?id=${item.id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            showErrorNotification({
                message: `${t('errors.activity_delete')}. ${t('try_again')}`,
                title: t('notification.error.title'),
            });
        } else {
            await queryClient.invalidateQueries(['activities-count']);
            await queryClient.invalidateQueries(['activities']);
        }
    };

    const onEdit = (item: Activity) => {
        const onSave = async () => {
            await queryClient.invalidateQueries(['activities', page]);
        };

        openNewActivityModal({
            centered: true,
            innerProps: {
                initialData: {
                    activity: item.activity,
                    date: parseISO(item.date),
                    id: item.id,
                },
                onSave,
            },
            size: 'sm',
            title: t('edit_activity'),
        });
    };

    const onPageChange = useCallback((page: number) => {
        setPage(page);
    }, []);

    const handleAddActivity = useCallback(() => {
        openNewActivityModal({
            centered: true,
            innerProps: {
                onSave: onNewActivitySave,
            },
            size: 'sm',
            title: t('add_activity'),
        });
    }, [onNewActivitySave, t]);

    return (
        <Stack gap="md">
            <Group justify="space-between">
                <Title order={3}>{t('activities')}</Title>
                <ActionIcon
                    onClick={handleAddActivity}
                    size="lg"
                    title={t('add_activity')}
                    variant="light"
                >
                    <Plus />
                </ActionIcon>
            </Group>
            <Box style={{ minHeight: 100 }}>
                <LoadingOverlay visible={isLoading} />
                {activities.length > 0 ? (
                    <Table
                        data={activities}
                        headers={headers}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        onPageChange={onPageChange}
                        page={page}
                        totalPages={totalPages}
                    />
                ) : (
                    !isLoading && (
                        <Center style={{ height: 100 }}>
                            <Title order={4}>{t('no_activities_yet')}</Title>
                        </Center>
                    )
                )}
            </Box>
        </Stack>
    );
};
