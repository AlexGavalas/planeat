import { Button, Center, Group, Rating, Stack } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { useTranslation } from 'next-i18next';
import { type FormEventHandler, type MouseEventHandler, useState } from 'react';

import { type Meal } from '~types/meal';

type MealRatingModalProps = {
    meal: Meal;
    handleSave: (rating: number) => Promise<void>;
    handleDelete: () => Promise<void>;
};

export const MealRatingModal = ({
    meal,
    handleDelete,
    handleSave,
}: MealRatingModalProps) => {
    const { t } = useTranslation();
    const modals = useModals();
    const [rating, setRating] = useState<number>();

    const closeModal = () => {
        modals.closeAll();
    };

    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- async event handler
    const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        if (!rating) {
            return;
        }

        await handleSave(rating);
        closeModal();
    };

    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- async event handler
    const onDelete: MouseEventHandler<HTMLButtonElement> = async () => {
        await handleDelete();
        closeModal();
    };

    return (
        <form onSubmit={onSubmit}>
            <Stack gap="xl">
                <Center>
                    <Rating
                        defaultValue={Number(meal.rating)}
                        onChange={setRating}
                    />
                </Center>
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
                        <Button type="submit" disabled={!rating}>
                            {t('save')}
                        </Button>
                    </Group>
                </Group>
            </Stack>
        </form>
    );
};
