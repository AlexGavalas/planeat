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
import { ActivityModal } from '~features/modals/activity';
import { useProfile } from '~hooks/use-profile';
import { type Database } from '~types/supabase';

import { Row } from './row';

const INITIAL_PAGE = 1;
const PAGE_SIZE = 5;

export const ActivitiesTable = () => {
    const { t } = useTranslation();
    const modals = useModals();
    const { profile } = useProfile();
    const queryClient = useQueryClient();
    const supabase = useSupabaseClient<Database>();
    const [page, setPage] = useState(INITIAL_PAGE);

    const { data: count = 0, isFetched } = useQuery(
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

            return supabase
                .from('activities')
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

    const onNewWeightSave = async () => {
        setPage(INITIAL_PAGE);

        await queryClient.invalidateQueries(['activities-count']);
        await queryClient.invalidateQueries(['activities']);
    };

    const loading = (!activities.length && !isFetched) || isFetching;

    return (
        <Stack spacing="md">
            <Group position="apart">
                <Title order={3}>{t('activities')}</Title>
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
                                <ActivityModal
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
                {activities.length > 0 ? (
                    <Stack spacing="md">
                        <Table highlightOnHover>
                            <thead>
                                <tr>
                                    <th style={{ width: '25%' }}>
                                        {t('date')}
                                    </th>
                                    <th style={{ width: '40%' }}>
                                        {t('activity.label')}
                                    </th>
                                    <th style={{ width: '35%' }}>
                                        {t('actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {activities.map((item) => (
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
        </Stack>
    );
};
