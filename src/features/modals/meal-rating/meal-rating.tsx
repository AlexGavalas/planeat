import { Button, Center, Group, Rating, Stack } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { useTranslation } from 'next-i18next';
import { type FormEventHandler, type MouseEventHandler, useState } from 'react';

import { type Meal } from '~types/meal';

type MealRatingModalProps = {
    meal: Meal;
    onSave: (rating: number) => Promise<void>;
    onDelete: () => Promise<void>;
};

export const MealRatingModal = ({
    meal,
    onDelete,
    onSave,
}: MealRatingModalProps) => {
    const { t } = useTranslation();
    const modals = useModals();
    const [rating, setRating] = useState<number>();

    const closeModal = () => {
        modals.closeAll();
    };

    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- async event handler
    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        if (!rating) {
            return;
        }

        await onSave(rating);
        closeModal();
    };

    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- async event handler
    const handleDelete: MouseEventHandler<HTMLButtonElement> = async () => {
        await onDelete();
        closeModal();
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack gap="xl">
                <Center>
                    <Rating
                        defaultValue={Number(meal.rating)}
                        onChange={setRating}
                    />
                </Center>
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
                        <Button disabled={!rating} type="submit">
                            {t('save')}
                        </Button>
                    </Group>
                </Group>
            </Stack>
        </form>
    );
};
