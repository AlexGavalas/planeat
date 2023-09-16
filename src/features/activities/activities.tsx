import { ActionIcon, Card, Center, Group, Stack, Title } from '@mantine/core';
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
import { ActivityModal } from '~features/modals/activity';
import { useProfile } from '~hooks/use-profile';
import { type Activity } from '~types/activity';
import { type Database } from '~types/supabase';

export const Activities = () => {
    const { t } = useTranslation();
    const modals = useModals();
    const { profile } = useProfile();
    const queryClient = useQueryClient();
    const supabase = useSupabaseClient<Database>();
    const [page, setPage] = useState(INITIAL_PAGE);

    const { data: count = 0, isFetched: isCountFetched } = useQuery(
        ['activities-count'],
        async () => {
            if (!profile) {
                throw new Error(`User not logged in`);
            }

            const { count } = await supabase
                .from('activities')
                .select('id', { count: 'exact' })
                .eq('user_id', profile.id);

            return count;
        },
        {
            enabled: Boolean(profile),
        },
    );

    const { data: activities = [], isFetching } = useQuery(
        ['activities', page],
        async () => {
            if (!profile) {
                throw new Error(`User not logged in`);
            }

            const { data } = await supabase
                .from('activities')
                .select('*')
                .eq('user_id', profile.id)
                .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)
                .order('date', { ascending: false });

            return data ?? [];
        },
        {
            enabled: isCountFetched,
        },
    );

    const totalPages = Math.ceil((count || 0) / PAGE_SIZE);

    const onNewActivitySave = async () => {
        setPage(INITIAL_PAGE);

        await queryClient.invalidateQueries(['activities-count']);
        await queryClient.invalidateQueries(['activities']);
    };

    const loading = (!activities.length && !isCountFetched) || isFetching;

    const headers = [
        {
            label: t('date'),
            width: '25%',
            key: 'date',
            formatValue: (item: Activity) =>
                format(parseISO(item.date), 'dd/MM/yy'),
        },
        { label: t('activity.label'), key: 'activity', width: '40%' },
        { label: t('actions'), key: 'actions', width: '35%' },
    ];

    const onDelete = async (item: Activity) => {
        const { error } = await supabase
            .from('activities')
            .delete()
            .eq('id', item.id);

        if (error) {
            showNotification({
                title: t('error'),
                message: `${t('errors.activity_delete')}. ${t('try_again')}`,
                color: 'red',
            });
        } else {
            await queryClient.invalidateQueries(['activities-count']);
            await queryClient.invalidateQueries(['activities']);
        }
    };

    const onEdit = async (item: Activity) => {
        if (!profile) {
            return;
        }

        const onSave = async () => {
            await queryClient.invalidateQueries(['activities-count']);
            await queryClient.invalidateQueries(['activities', page]);
        };

        modals.openModal({
            title: t('edit_activity'),
            centered: true,
            size: 'sm',
            children: (
                <ActivityModal
                    userId={profile.id}
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

    const onPageChange = (page: number) => {
        setPage(page);
    };

    return (
        <Stack spacing="md">
            <Group position="apart">
                <Title order={3}>{t('activities')}</Title>
                <ActionIcon
                    title={t('add_activity')}
                    size="lg"
                    onClick={() => {
                        if (!profile) {
                            return;
                        }

                        modals.openModal({
                            title: t('add_activity'),
                            centered: true,
                            size: 'sm',
                            children: (
                                <ActivityModal
                                    userId={profile.id}
                                    onSave={onNewActivitySave}
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
                {activities.length > 0 ? (
                    <Table
                        data={activities}
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
            </Card>
        </Stack>
    );
};
