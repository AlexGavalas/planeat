import { Button, Center, Group, Rating, Stack } from '@mantine/core';
import { type ContextModalProps } from '@mantine/modals';
import {
    type MouseEventHandler,
    type SubmitEventHandler,
    useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { type Meal } from '~types/meal';

type MealRatingModalProps = {
    meal: Meal;
    onSave: (rating: number) => Promise<void>;
    onDelete: () => Promise<void>;
};

export const MealRatingModal = ({
    context,
    id,
    innerProps: { meal, onDelete, onSave },
}: ContextModalProps<MealRatingModalProps>) => {
    const { t } = useTranslation();
    const [rating, setRating] = useState<number>();

    const closeModal = () => {
        context.closeContextModal(id);
    };

    const handleSubmit = (async (e) => {
        e.preventDefault();

        if (!rating) {
            return;
        }

        await onSave(rating);
        closeModal();
    }) satisfies SubmitEventHandler<HTMLFormElement>;

    const handleDelete = (async () => {
        await onDelete();
        closeModal();
    }) satisfies MouseEventHandler<HTMLButtonElement>;

    return (
        <form onSubmit={handleSubmit}>
            <Stack gap="xl">
                <Center>
                    <Rating
                        defaultValue={Number(meal.rating)}
                        onChange={setRating}
                    />
                </Center>
                <Group justify="space-between">
                    <Button color="danger" onClick={closeModal} variant="light">
                        {t('generic.actions.cancel')}
                    </Button>
                    <Group gap="md">
                        {meal.rating && (
                            <Button color="danger" onClick={handleDelete}>
                                {t('generic.actions.delete')}
                            </Button>
                        )}
                        <Button disabled={!rating} type="submit">
                            {t('generic.actions.save')}
                        </Button>
                    </Group>
                </Group>
            </Stack>
        </form>
    );
};
