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

    const closeModal = () => {
        modals.closeAll();
    };

    const resetError = useCallback(() => {
        setError('');
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- async event handler
    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
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
    };

    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- async event handler
    const handleDelete: MouseEventHandler<HTMLButtonElement> = async () => {
        await onDelete();
        closeModal();
    };

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
                <Group gap="sm" justify="space-between">
                    <Button color="red" onClick={closeModal} variant="light">
                        {t('cancel')}
                    </Button>
                    <Group>
                        <Button
                            color="red"
                            hidden={!meal.note}
                            onClick={handleDelete}
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
