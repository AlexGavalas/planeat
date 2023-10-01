import { Button, Group, Stack, Textarea } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { useTranslation } from 'next-i18next';
import { type FormEventHandler, type MouseEventHandler, useState } from 'react';

import { type Meal } from '~types/meal';

type MealNoteModalProps = {
    meal: Meal;
    handleSave: (meal: string) => Promise<void>;
    handleDelete: () => Promise<void>;
};

const NOTE_FIELD_NAME = 'note';

export const MealNoteModal = ({
    meal,
    handleSave,
    handleDelete,
}: MealNoteModalProps) => {
    const { t } = useTranslation();
    const modals = useModals();
    const [error, setError] = useState('');

    const closeModal = () => {
        modals.closeAll();
    };

    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- async event handler
    const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        const note = new FormData(e.currentTarget)
            .get(NOTE_FIELD_NAME)
            ?.toString();

        if (!note) {
            setError(t('errors.note_empty'));
            return;
        }

        await handleSave(note);
        closeModal();
    };

    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- async event handler
    const onDelete: MouseEventHandler<HTMLButtonElement> = async () => {
        await handleDelete();
        closeModal();
    };

    return (
        <form onSubmit={onSubmit}>
            <Stack gap="sm">
                <Textarea
                    data-autofocus
                    name={NOTE_FIELD_NAME}
                    placeholder={t('modals.meal_note.placeholder')}
                    label={t('modals.meal_note.label')}
                    defaultValue={meal.note ?? ''}
                    autosize
                    minRows={5}
                    maxRows={20}
                    error={error}
                    onFocus={() => {
                        setError('');
                    }}
                />
                <Group justify="space-between" gap="sm">
                    <Button variant="light" color="red" onClick={closeModal}>
                        {t('cancel')}
                    </Button>
                    <Group>
                        <Button
                            color="red"
                            hidden={!meal.note}
                            onClick={onDelete}
                        >
                            {t('delete')}
                        </Button>
                        <Button type="submit">{t('save')}</Button>
                    </Group>
                </Group>
            </Stack>
        </form>
    );
};
