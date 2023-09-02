import { Button, Group, Popover, Stack, Text } from '@mantine/core';
import { useHover } from '@mantine/hooks';
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

import { Td } from './row-td';

interface RowProps {
    item: Measurement;
    page: number;
}

export const Row = ({ item, page }: RowProps) => {
    const { t } = useTranslation();
    const modals = useModals();
    const supabaseClient = useSupabaseClient<Database>();
    const queryClient = useQueryClient();
    const { profile: user } = useProfile();
    const { hovered, ref: hoverRef } = useHover<HTMLTableRowElement>();
    const [edit, setEdit] = useState(false);
    const [newWeight, setNewWeight] = useState(item.weight);
    const [newFat, setNewFat] = useState(item.fat_percentage);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [deleteInProgress, setDeleteInProgress] = useState(false);

    const handleSave = async () => {
        const { error } = await supabaseClient
            .from('measurements')
            .update({ weight: newWeight, fat_percentage: newFat })
            .eq('id', item.id);

        if (error) {
            showNotification({
                title: t('error'),
                message: `${t('errors.measurement_update')}. ${t('try_again')}`,
                color: 'red',
            });
        } else {
            queryClient.invalidateQueries(['measurements', page]);
            setEdit(false);
        }
    };

    const handleDelete = async () => {
        setDeleteInProgress(true);

        const { error } = await supabaseClient
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
            queryClient.invalidateQueries(['measurements', page]);
            setDeleteInProgress(false);
            setOpenConfirmation(false);
        }
    };

    const handleCancel = () => setEdit(false);

    return (
        <tr style={{ width: '100%', height: '3rem' }} ref={hoverRef}>
            <td style={{ width: '25%' }}>
                {format(parseISO(item.date), 'dd/MM/yy')}
            </td>
            <Td
                cancel={handleCancel}
                edit={edit}
                hovered={hovered}
                save={handleSave}
                set={setNewWeight}
                setEdit={() => setEdit(true)}
                value={item.weight}
            />
            <Td
                cancel={handleCancel}
                edit={edit}
                hovered={hovered}
                save={handleSave}
                set={setNewFat}
                setEdit={() => setEdit(true)}
                value={item.fat_percentage}
            />
            <td style={{ width: '25%' }}>
                <Group spacing="md">
                    <Button
                        className="button"
                        size="xs"
                        onClick={() => {
                            if (!user) return;

                            modals.openModal({
                                title: t('new_measurement'),
                                centered: true,
                                size: 'sm',
                                children: (
                                    <MeasurementModal
                                        userId={user.id}
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
                                        className="button"
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
