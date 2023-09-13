import { Button, Group, Popover, Stack, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { format, parseISO } from 'date-fns';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { useQueryClient } from 'react-query';

import { MeasurementModal } from '~features/modals/measurement';
import { useProfile } from '~hooks/use-profile';
import { type Database } from '~types/supabase';
import { type Measurement } from '~types/types';

interface RowProps {
    item: Measurement;
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

            setDeleteInProgress(false);
            setOpenConfirmation(false);
        }
    };

    return (
        <tr style={{ width: '100%', height: '3rem' }}>
            <td style={{ width: '25%' }}>
                {format(parseISO(item.date), 'dd/MM/yy')}
            </td>
            <td style={{ width: '20%' }}>{item.weight}</td>
            <td style={{ width: '20%' }}>{item.fat_percentage}</td>
            <td style={{ width: '35%' }}>
                <Group spacing="md" grow>
                    <Button
                        size="xs"
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
                                        initialData={{
                                            id: item.id,
                                            date: parseISO(item.date),
                                            ...(item.fat_percentage && {
                                                fat_percentage:
                                                    item.fat_percentage,
                                            }),
                                            ...(item.weight && {
                                                weight: item.weight,
                                            }),
                                        }}
                                        onSave={() => {
                                            queryClient.invalidateQueries([
                                                'measurements',
                                                page,
                                            ]);
                                        }}
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
