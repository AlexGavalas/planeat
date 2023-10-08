import { Button, Center, Group, Rating, Stack } from '@mantine/core';
import { type ContextModalProps } from '@mantine/modals';
import { useTranslation } from 'next-i18next';
import {
    type FormEventHandler,
    type MouseEventHandler,
    useCallback,
    useState,
} from 'react';

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

    const closeModal = useCallback(() => {
        context.closeContextModal(id);
    }, [context]);

    const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
        async (e) => {
            e.preventDefault();

            if (!rating) {
                return;
            }

            await onSave(rating);
            closeModal();
        },
        [closeModal, onSave, rating],
    );

    const handleDelete = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(async () => {
        await onDelete();
        closeModal();
    }, [closeModal, onDelete]);

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
                    <Button color="red" onClick={closeModal} variant="light">
                        {t('generic.actions.cancel')}
                    </Button>
                    <Group gap="md">
                        {meal.rating && (
                            <Button color="red" onClick={handleDelete}>
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
