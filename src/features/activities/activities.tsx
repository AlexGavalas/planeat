import { ActionIcon, Box, Center, Group, Stack, Title } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { format, parseISO } from 'date-fns';
import { Plus } from 'iconoir-react';
import { useTranslation } from 'next-i18next';
import { useCallback, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { LoadingOverlay } from '~components/loading-overlay';
import { INITIAL_PAGE, PAGE_SIZE, Table } from '~components/table';
import { ActivityModal } from '~features/modals/activity';
import { useProfile } from '~hooks/use-profile';
import { type Activity } from '~types/activity';
import { showErrorNotification } from '~util/notification';

export const Activities = () => {
    const { t } = useTranslation();
    const modals = useModals();
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
                label: t('date'),
                width: '25%',
                key: 'date',
                formatValue: (item: Activity) =>
                    format(parseISO(item.date), 'dd/MM/yy'),
            },
            {
                label: t('activity.label'),
                key: 'activity',
                width: '40%',
            },
            {
                label: t('actions'),
                key: 'actions',
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
                title: t('error'),
                message: `${t('errors.activity_delete')}. ${t('try_again')}`,
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

        modals.openModal({
            title: t('edit_activity'),
            centered: true,
            size: 'sm',
            children: (
                <ActivityModal
                    initialData={{
                        id: item.id,
                        date: parseISO(item.date),
                        activity: item.activity,
                    }}
                    onSave={onSave}
                />
            ),
        });
    };

    const onPageChange = useCallback((page: number) => {
        setPage(page);
    }, []);

    const handleAddActivity = useCallback(() => {
        modals.openModal({
            title: t('add_activity'),
            centered: true,
            size: 'sm',
            children: <ActivityModal onSave={onNewActivitySave} />,
        });
    }, [modals, onNewActivitySave, t]);

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
