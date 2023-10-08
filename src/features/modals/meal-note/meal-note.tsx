import { Button, Group, Stack, Textarea } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { useTranslation } from 'next-i18next';
import {
    type FormEventHandler,
    type MouseEventHandler,
    useCallback,
    useState,
} from 'react';

import { type Meal } from '~types/meal';

type MealNoteModalProps = {
    meal: Meal;
    onSave: (meal: string) => Promise<void>;
    onDelete: () => Promise<void>;
};

const NOTE_FIELD_NAME = 'note';

export const MealNoteModal = ({
    meal,
    onSave,
    onDelete,
}: MealNoteModalProps) => {
    const { t } = useTranslation();
    const modals = useModals();
    const [error, setError] = useState('');

    const closeModal = useCallback(() => {
        modals.closeAll();
    }, [modals]);

    const resetError = useCallback(() => {
        setError('');
    }, []);

    const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
        async (e) => {
            e.preventDefault();

            const note = new FormData(e.currentTarget)
                .get(NOTE_FIELD_NAME)
                ?.toString();

            if (!note) {
                setError(t('errors.note_empty'));
                return;
            }

            await onSave(note);
            closeModal();
        },
        [closeModal, onSave, t],
    );

    const handleDelete = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(async () => {
        await onDelete();
        closeModal();
    }, [closeModal, onDelete]);

    return (
        <form onSubmit={handleSubmit}>
            <Stack gap="sm">
                <Textarea
                    autosize
                    data-autofocus
                    defaultValue={meal.note ?? ''}
                    error={error}
                    label={t('modals.meal_note.label')}
                    maxRows={20}
                    minRows={5}
                    name={NOTE_FIELD_NAME}
                    onFocus={resetError}
                    placeholder={t('modals.meal_note.placeholder')}
                />
                <Group justify="space-between">
                    <Button color="red" onClick={closeModal} variant="light">
                        {t('generic.actions.cancel')}
                    </Button>
                    <Group gap="md">
                        <Button
                            color="red"
                            hidden={!meal.note}
                            onClick={handleDelete}
                        >
                            {t('generic.actions.delete')}
                        </Button>
                        <Button type="submit">
                            {t('generic.actions.save')}
                        </Button>
                    </Group>
                </Group>
            </Stack>
        </form>
    );
};
