import {
    ActionIcon,
    type ActionIconProps,
    Center,
    Overlay,
    SimpleGrid,
} from '@mantine/core';
import { useModals } from '@mantine/modals';
import { EditPencil, Notes, ThreeStars } from 'iconoir-react';
import { useTranslation } from 'next-i18next';
import { useCallback } from 'react';

import { CopyButton } from '~components/copy-button';
import { MealModal } from '~features/modals/meal';
import { MealNoteModal } from '~features/modals/meal-note';
import { MealRatingModal } from '~features/modals/meal-rating';
import { type EditedMeal, type Meal } from '~types/meal';

interface CellOverlayProps {
    handleDelete: () => Promise<void>;
    handleSave: (value: Partial<Meal>) => Promise<void>;
    meal?: Meal | EditedMeal;
}

const isSavedMeal = (meal?: Meal | EditedMeal): meal is Meal => {
    return meal?.id !== undefined;
};

const isFilledMeal = (meal?: Meal | EditedMeal): meal is Meal => {
    return Boolean(meal?.meal);
};

const commonButtonProps = {
    variant: 'light',
    size: 'lg',
} satisfies ActionIconProps;

export const CellOverlay = ({
    handleDelete,
    handleSave,
    meal,
}: CellOverlayProps) => {
    const { t } = useTranslation();
    const modals = useModals();

    const isMealSaved = isSavedMeal(meal);
    const mealHasContent = isFilledMeal(meal);

    const handleMealSave = useCallback(
        async (value: string) => {
            handleSave({ ...meal, meal: value });
        },
        [handleSave, meal],
    );

    const handleMealNoteSave = useCallback(
        async (note: string) => {
            handleSave({ ...meal, note });
        },
        [handleSave, meal],
    );

    const handleMealNoteDelete = useCallback(async () => {
        handleSave({ ...meal, note: null });
    }, [handleSave, meal]);

    const handleMealRatingSave = useCallback(
        async (rating: number) => {
            handleSave({ ...meal, rating });
        },
        [handleSave, meal],
    );

    const handleMealRatingDelete = useCallback(async () => {
        handleSave({ ...meal, rating: null });
    }, [handleSave, meal]);

    const handleEditClick = useCallback(() => {
        modals.openModal({
            title: t('edit_meal'),
            centered: true,
            children: (
                <MealModal
                    handleSave={handleMealSave}
                    initialMeal={meal?.meal || ''}
                    deleteMeal={handleDelete}
                />
            ),
        });
    }, [handleDelete, handleMealSave, meal?.meal, modals, t]);

    const handleNoteClick = useCallback(() => {
        if (!isMealSaved) {
            return;
        }

        modals.openModal({
            title: t('notes'),
            centered: true,
            children: (
                <MealNoteModal
                    meal={meal}
                    handleSave={handleMealNoteSave}
                    handleDelete={handleMealNoteDelete}
                />
            ),
        });
    }, [
        handleMealNoteDelete,
        handleMealNoteSave,
        isMealSaved,
        meal,
        modals,
        t,
    ]);

    const handleRateClick = useCallback(() => {
        if (!isMealSaved) {
            return;
        }

        modals.openModal({
            title: t('modals.meal_rate.title'),
            centered: true,
            children: (
                <MealRatingModal
                    meal={meal}
                    handleSave={handleMealRatingSave}
                    handleDelete={handleMealRatingDelete}
                />
            ),
        });
    }, [
        handleMealRatingDelete,
        handleMealRatingSave,
        isMealSaved,
        meal,
        modals,
        t,
    ]);

    const shouldShowColumnLayout = isMealSaved || mealHasContent;

    return (
        <Overlay style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
            <Center style={{ height: '100%' }}>
                <SimpleGrid
                    spacing={4}
                    verticalSpacing={4}
                    cols={shouldShowColumnLayout ? 2 : 1}
                >
                    <ActionIcon
                        {...commonButtonProps}
                        title={t('edit')}
                        onClick={handleEditClick}
                    >
                        <EditPencil />
                    </ActionIcon>
                    {isMealSaved && (
                        <>
                            <ActionIcon
                                {...commonButtonProps}
                                title={t('edit')}
                                onClick={handleNoteClick}
                            >
                                <Notes />
                            </ActionIcon>
                            <ActionIcon
                                {...commonButtonProps}
                                title={t('modals.meal_rate.title')}
                                onClick={handleRateClick}
                            >
                                <ThreeStars />
                            </ActionIcon>
                        </>
                    )}
                    {mealHasContent && <CopyButton value={meal.meal} />}
                </SimpleGrid>
            </Center>
        </Overlay>
    );
};
