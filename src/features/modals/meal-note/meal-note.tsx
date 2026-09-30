import { Button, Group, Stack, Textarea } from '@mantine/core';
import { type ContextModalProps } from '@mantine/modals';
import {
    type MouseEventHandler,
    type SubmitEventHandler,
    useCallback,
    useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { type Meal } from '~types/meal';

type MealNoteModalProps = {
    meal: Meal;
    onSave: (meal: string) => Promise<void>;
    onDelete: () => Promise<void>;
};

const NOTE_FIELD_NAME = 'note';

const formSchema = z.object({
    note: z.string(),
});

export const MealNoteModal = ({
    context,
    id,
    innerProps: { meal, onSave, onDelete },
}: ContextModalProps<MealNoteModalProps>) => {
    const { t } = useTranslation();
    const [error, setError] = useState('');

    const closeModal = useCallback(() => {
        context.closeContextModal(id);
    }, [context, id]);

    const resetError = useCallback(() => {
        setError('');
    }, []);

    const handleSubmit = useCallback<SubmitEventHandler<HTMLFormElement>>(
        async (e) => {
            e.preventDefault();

            const formData = Object.fromEntries(new FormData(e.currentTarget));

            const { note } = formSchema.parse(formData);

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
                    <Button color="danger" onClick={closeModal} variant="light">
                        {t('generic.actions.cancel')}
                    </Button>
                    <Group gap="md">
                        {meal.note && (
                            <Button color="danger" onClick={handleDelete}>
                                {t('generic.actions.delete')}
                            </Button>
                        )}
                        <Button type="submit">
                            {t('generic.actions.save')}
                        </Button>
                    </Group>
                </Group>
            </Stack>
        </form>
    );
};
