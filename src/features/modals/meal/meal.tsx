import { Button, Group, Stack, Textarea } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { useTranslation } from 'next-i18next';
import { type FormEventHandler, type MouseEventHandler, useState } from 'react';

type MealModalProps = {
    deleteMeal: () => Promise<void> | void;
    handleSave: (meal: string) => Promise<void> | void;
    initialMeal: string;
};

export const MealModal = ({
    handleSave,
    initialMeal,
    deleteMeal,
}: MealModalProps) => {
    const { t } = useTranslation();
    const modals = useModals();
    const [error, setError] = useState('');

    const closeModal = () => {
        modals.closeAll();
    };

    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- async event handler
    const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        const meal = new FormData(e.currentTarget).get('meal')?.toString();

        if (!meal) {
            setError(t('errors.meal_empty'));
            return;
        }

        await handleSave(meal);

        closeModal();
    };

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const onDelete: MouseEventHandler<HTMLButtonElement> = async () => {
        await deleteMeal();
        closeModal();
    };

    return (
        <form onSubmit={onSubmit}>
            <Stack gap="sm">
                <Textarea
                    data-autofocus
                    name="meal"
                    placeholder={t('meal_placeholder')}
                    label={t('meal_label')}
                    defaultValue={initialMeal}
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
                            hidden={!initialMeal}
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
