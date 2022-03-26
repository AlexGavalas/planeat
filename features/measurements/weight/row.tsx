import { NumberInput, ActionIcon, Group } from '@mantine/core';
import { useEventListener, useHover } from '@mantine/hooks';
import { useNotifications } from '@mantine/notifications';
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import { format, parseISO } from 'date-fns';
import { EditPencil, SaveFloppyDisk, Cancel } from 'iconoir-react';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { useQueryClient } from 'react-query';

interface RowProps {
    item: WeightData;
    page: number;
}

export const Row = ({ item, page }: RowProps) => {
    const { t } = useTranslation();

    const [edit, setEdit] = useState(false);
    const [newWeight, setNewWeight] = useState(item.weight);

    const notifications = useNotifications();
    const { hovered, ref: hoverRef } = useHover<HTMLTableRowElement>();

    const ref = useEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            handleCancel();
        }
    });

    const queryClient = useQueryClient();

    const handleSave = async () => {
        const { error } = await supabaseClient
            .from('weight-measurements')
            .update({ weight: newWeight })
            .eq('id', item.id);

        if (error) {
            notifications.showNotification({
                title: t('error'),
                message: `${t('errors.weight_update')}. ${t('try_again')}`,
                color: 'red',
            });
        } else {
            queryClient.invalidateQueries(['measurements', page]);
            setEdit(false);
        }
    };

    const handleCancel = () => {
        setEdit(false);
    };

    return (
        <tr style={{ height: '3rem' }} ref={hoverRef}>
            <td>{format(parseISO(item.date), 'dd/MM/yy')}</td>
            <td style={{ width: '50%' }} ref={ref}>
                <Group>
                    {edit ? (
                        <NumberInput
                            autoFocus
                            size="xs"
                            defaultValue={item.weight}
                            onChange={(v) => {
                                v && setNewWeight(v);
                            }}
                            precision={2}
                        />
                    ) : (
                        item.weight
                    )}
                    {hovered && !edit && (
                        <ActionIcon
                            size="sm"
                            onClick={() => setEdit(true)}
                            title={t('edit')}
                        >
                            <EditPencil />
                        </ActionIcon>
                    )}
                    {edit && (
                        <Group>
                            <ActionIcon
                                size="sm"
                                onClick={handleSave}
                                title={t('save')}
                            >
                                <SaveFloppyDisk />
                            </ActionIcon>
                            <ActionIcon
                                size="sm"
                                onClick={handleCancel}
                                title={t('cancel')}
                            >
                                <Cancel />
                            </ActionIcon>
                        </Group>
                    )}
                </Group>
            </td>
        </tr>
    );
};
