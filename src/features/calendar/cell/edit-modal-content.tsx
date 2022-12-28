import { Button, Group, Textarea } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { useTranslation } from 'next-i18next';
import { type FormEventHandler, useState } from 'react';

interface ModalContentProps {
    deleteMeal: () => Promise<void>;
    handleSave: (meal: string) => Promise<void>;
    initialMeal: string;
}

export const ModalContent = ({
    handleSave,
    initialMeal,
    deleteMeal,
}: ModalContentProps) => {
    const { t } = useTranslation();

    const modals = useModals();
    const [error, setError] = useState('');

    const closeModal = () => modals.closeAll();

    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        const meal = new FormData(e.currentTarget).get('meal')?.toString();

        if (!meal) return setError(t('errors.meal_empty').toString());

        handleSave(meal);
        closeModal();
    };

    const onDelete = () => {
        deleteMeal();
        closeModal();
    };

    return (
        <form onSubmit={onSubmit}>
            <Group direction="column" spacing="sm" grow>
                <Textarea
                    data-autofocus
                    name="meal"
                    placeholder={t('meal_placeholder').toString()}
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
                        <Button type="submit">{t('save')}</Button>
                    </Group>
                </Group>
            </Group>
        </form>
    );
};
