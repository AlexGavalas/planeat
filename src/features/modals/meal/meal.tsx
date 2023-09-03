import { Button, Group, Stack, Textarea } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { useTranslation } from 'next-i18next';
import { type FormEventHandler, useState } from 'react';

interface MealModalProps {
    deleteMeal: () => Promise<void>;
    handleSave: (meal: string) => Promise<void>;
    initialMeal: string;
}

export const MealModal = ({
    handleSave,
    initialMeal,
    deleteMeal,
}: MealModalProps) => {
    const { t } = useTranslation();
    const modals = useModals();
    const [error, setError] = useState('');

    const closeModal = () => modals.closeAll();

    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        const meal = new FormData(e.currentTarget).get('meal')?.toString();

        if (!meal) return setError(t('errors.meal_empty'));

        handleSave(meal);
        closeModal();
    };

    const onDelete = () => {
        deleteMeal();
        closeModal();
    };

    return (
        <form onSubmit={onSubmit}>
            <Stack spacing="sm">
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
                    onFocus={() => setError('')}
                />
                <Group position="apart" spacing="sm">
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
                        <Button className="button" type="submit">
                            {t('save')}
                        </Button>
                    </Group>
                </Group>
            </Stack>
        </form>
    );
};
