import { Button, Group, Popover, Stack, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { format, parseISO } from 'date-fns';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { useQueryClient } from 'react-query';

import { ActivityModal } from '~features/modals/activity';
import { useProfile } from '~hooks/use-profile';
import { type Activity } from '~types/activity';
import { type Database } from '~types/supabase';

interface RowProps {
    item: Activity;
    page: number;
}

export const Row = ({ item, page }: RowProps) => {
    const { t } = useTranslation();
    const modals = useModals();
    const supabase = useSupabaseClient<Database>();
    const queryClient = useQueryClient();
    const { profile } = useProfile();

    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [deleteInProgress, setDeleteInProgress] = useState(false);

    const handleDelete = async () => {
        setDeleteInProgress(true);

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

            setDeleteInProgress(false);
            setOpenConfirmation(false);
        }
    };

    const handleSave = async () => {
        await queryClient.invalidateQueries(['activities-count']);
        await queryClient.invalidateQueries(['activities', page]);
    };

    return (
        <tr style={{ width: '100%', height: '3rem' }}>
            <td style={{ width: '25%' }}>
                {format(parseISO(item.date), 'dd/MM/yy')}
            </td>
            <td style={{ width: '40%' }}>{item.activity}</td>
            <td style={{ width: '35%' }}>
                <Group spacing="md" grow>
                    <Button
                        size="xs"
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
                                        initialData={{
                                            id: item.id,
                                            date: parseISO(item.date),
                                            activity: item.activity,
                                        }}
                                        onSave={handleSave}
                                    />
                                ),
                            });
                        }}
                    >
                        {t('edit')}
                    </Button>
                    <Popover
                        shadow="md"
                        withArrow
                        withinPortal
                        trapFocus
                        closeOnEscape
                        closeOnClickOutside
                        opened={openConfirmation}
                        onChange={setOpenConfirmation}
                    >
                        <Popover.Target>
                            <Button
                                color="red"
                                size="xs"
                                onClick={() => setOpenConfirmation(true)}
                            >
                                {t('delete')}
                            </Button>
                        </Popover.Target>
                        <Popover.Dropdown>
                            <Stack spacing="md" align="center">
                                <Text>{t('confirmation.generic')}</Text>
                                <Group spacing="md">
                                    <Button
                                        color="red"
                                        size="xs"
                                        variant="outline"
                                        onClick={() => {
                                            setOpenConfirmation(false);
                                        }}
                                    >
                                        {t('confirmation.no')}
                                    </Button>
                                    <Button
                                        size="xs"
                                        onClick={handleDelete}
                                        loading={deleteInProgress}
                                    >
                                        {t('confirmation.yes')}
                                    </Button>
                                </Group>
                            </Stack>
                        </Popover.Dropdown>
                    </Popover>
                </Group>
            </td>
        </tr>
    );
};
