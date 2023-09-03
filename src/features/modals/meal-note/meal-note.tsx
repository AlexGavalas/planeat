import { Button, Group, Stack, Textarea } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { useTranslation } from 'next-i18next';
import { type FormEventHandler, useState } from 'react';

interface MealNoteModalProps {
    meal: Meal;
    handleSave: (meal: string) => Promise<void>;
    handleDelete: () => Promise<void>;
}

const NOTE_FIELD_NAME = 'note';

export const MealNoteModal = ({
    meal,
    handleSave,
    handleDelete,
}: MealNoteModalProps) => {
    const { t } = useTranslation();
    const modals = useModals();
    const [error, setError] = useState('');

    const closeModal = () => modals.closeAll();

    const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        const note = new FormData(e.currentTarget)
            .get(NOTE_FIELD_NAME)
            ?.toString();

        if (!note) {
            return setError(t('errors.note_empty'));
        }

        await handleSave(note);
        closeModal();
    };

    const onDelete = async () => {
        await handleDelete();
        closeModal();
    };

    return (
        <form onSubmit={onSubmit}>
            <Stack spacing="sm">
                <Textarea
                    data-autofocus
                    name={NOTE_FIELD_NAME}
                    placeholder={t('modals.meal_note.placeholder')}
                    label={t('modals.meal_note.label')}
                    defaultValue={meal.note}
                    autosize
                    minRows={5}
                    maxRows={20}
                    error={error}
                    onFocus={() => setError('')}
                />
                <Group position="apart" spacing="sm">
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
                        <Button className="button" type="submit">
                            {t('save')}
                        </Button>
                    </Group>
                </Group>
            </Stack>
        </form>
    );
};
