import { ActionIcon, Group, NumberInput } from '@mantine/core';
import { useEventListener } from '@mantine/hooks';
import { Cancel, EditPencil, SaveFloppyDisk } from 'iconoir-react';
import { useTranslation } from 'next-i18next';

interface TdProps {
    edit: boolean;
    hovered: boolean;
    value: number | null;
    set: (value: number) => void;
    save: () => void;
    cancel: () => void;
    setEdit: () => void;
}

export const Td = ({
    edit,
    hovered,
    value,
    cancel,
    save,
    set,
    setEdit,
}: TdProps) => {
    const { t } = useTranslation();

    const ref = useEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            cancel();
        }
    });

    return (
        <td ref={ref} style={{ width: '25%' }}>
            <Group>
                {edit ? (
                    <NumberInput
                        autoFocus
                        size="xs"
                        defaultValue={value ?? undefined}
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
