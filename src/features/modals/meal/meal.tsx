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

    const closeModal = () => {
        modals.closeAll();
    };

    const resetError = useCallback(() => {
        setError('');
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- async event handler
    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        const meal = new FormData(e.currentTarget).get('meal')?.toString();

        if (!meal) {
            setError(t('errors.meal_empty'));
            return;
        }

        await onSave(meal);

        closeModal();
    };

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
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
                    defaultValue={initialMeal}
                    error={error}
                    label={t('meal_label')}
                    maxRows={20}
                    minRows={5}
                    name="meal"
                    onFocus={resetError}
                    placeholder={t('meal_placeholder')}
                />
                <Group gap="sm" justify="space-between">
                    <Button color="red" onClick={closeModal} variant="light">
                        {t('cancel')}
                    </Button>
                    <Group>
                        <Button
                            color="red"
                            hidden={!initialMeal}
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
