import { Button, Group, Stack, Textarea } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { useTranslation } from 'next-i18next';
import {
    type FormEventHandler,
    type MouseEventHandler,
    useCallback,
    useState,
} from 'react';

type MealModalProps = {
    onDelete: () => Promise<void> | void;
    onSave: (meal: string) => Promise<void> | void;
    initialMeal: string;
};

export const MealModal = ({
    onSave,
    onDelete,
    initialMeal,
}: MealModalProps) => {
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

            const meal = new FormData(e.currentTarget).get('meal')?.toString();

            if (!meal) {
                setError(t('errors.meal_empty'));
                return;
            }

            await onSave(meal);

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
                    defaultValue={initialMeal}
                    error={error}
                    label={t('meal_label')}
                    maxRows={20}
                    minRows={5}
                    name="meal"
                    onFocus={resetError}
                    placeholder={t('meal_placeholder')}
                />
                <Group justify="space-between">
                    <Button color="red" onClick={closeModal} variant="light">
                        {t('generic.actions.cancel')}
                    </Button>
                    <Group gap="md">
                        {initialMeal && (
                            <Button color="red" onClick={handleDelete}>
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
