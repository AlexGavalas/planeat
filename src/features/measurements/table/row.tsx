import { ActionIcon, Group, NumberInput } from '@mantine/core';
import { useEventListener, useHover } from '@mantine/hooks';
import { useNotifications } from '@mantine/notifications';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { format, parseISO } from 'date-fns';
import { Cancel, EditPencil, SaveFloppyDisk } from 'iconoir-react';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { useQueryClient } from 'react-query';

interface RowProps {
    item: Measurement;
    page: number;
}

interface TdProps {
    edit: boolean;
    hovered: boolean;
    value: number;
    set: (value: number) => void;
    save: () => void;
    cancel: () => void;
    setEdit: () => void;
}

const Td = ({ edit, hovered, value, cancel, save, set, setEdit }: TdProps) => {
    const { t } = useTranslation();

    const ref = useEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            cancel();
        }
    });

    return (
        <td ref={ref} style={{ width: '33%' }}>
            <Group>
                {edit ? (
                    <NumberInput
                        autoFocus
                        size="xs"
                        defaultValue={value}
                        precision={2}
                        onChange={(v) => {
                            v && set(v);
                        }}
                    />
                ) : (
                    value
                )}
                {hovered && !edit && (
                    <ActionIcon size="sm" onClick={setEdit} title={t('edit')}>
                        <EditPencil />
                    </ActionIcon>
                )}
                {edit && (
                    <Group>
                        <ActionIcon size="sm" onClick={save} title={t('save')}>
                            <SaveFloppyDisk />
                        </ActionIcon>
                        <ActionIcon
                            size="sm"
                            onClick={cancel}
                            title={t('cancel')}
                        >
                            <Cancel />
                        </ActionIcon>
                    </Group>
                )}
            </Group>
        </td>
    );
};

export const Row = ({ item, page }: RowProps) => {
    const { t } = useTranslation();

    const notifications = useNotifications();
    const { hovered, ref: hoverRef } = useHover<HTMLTableRowElement>();

    const [edit, setEdit] = useState(false);
    const [newWeight, setNewWeight] = useState(item.weight);
    const [newFat, setNewFat] = useState(item.fat_percentage);

    const queryClient = useQueryClient();

    const handleSave = async () => {
        const { error } = await supabaseClient
            .from<Measurement>('measurements')
            .update({ weight: newWeight, fat_percentage: newFat })
            .eq('id', item.id);

        if (error) {
            notifications.showNotification({
                title: t('error'),
                message: `${t('errors.measurement_update')}. ${t('try_again')}`,
                color: 'red',
            });
        } else {
            queryClient.invalidateQueries(['measurements', page]);
            setEdit(false);
        }
    };

    const handleCancel = () => setEdit(false);

    return (
        <tr style={{ width: '100%', height: '3rem' }} ref={hoverRef}>
            <td style={{ width: '33%' }}>
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
        </tr>
    );
};
