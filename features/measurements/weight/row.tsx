import { NumberInput, ActionIcon } from '@mantine/core';
import { useEventListener, useHover } from '@mantine/hooks';
import { useNotifications } from '@mantine/notifications';
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import { format, parseISO } from 'date-fns';
import { Group, EditPencil, SaveFloppyDisk, Cancel } from 'iconoir-react';
import { useState } from 'react';
import { useQueryClient } from 'react-query';

interface RowProps {
    item: WeightData;
    page: number;
}

export const Row = ({ item, page }: RowProps) => {
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
                title: 'Error',
                message: 'We could not update your weight. Please try again.',
                color: 'red',
                autoClose: 5000,
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
                            title="Edit"
                        >
                            <EditPencil />
                        </ActionIcon>
                    )}
                    {edit && (
                        <Group>
                            <ActionIcon
                                size="sm"
                                onClick={handleSave}
                                title="Save"
                            >
                                <SaveFloppyDisk />
                            </ActionIcon>
                            <ActionIcon
                                size="sm"
                                onClick={handleCancel}
                                title="Cancel"
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
