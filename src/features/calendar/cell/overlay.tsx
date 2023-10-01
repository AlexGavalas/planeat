import {
    ActionIcon,
    type ActionIconProps,
    Center,
    Overlay,
    SimpleGrid,
    Tooltip,
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

type CellOverlayProps = {
    handleDelete: () => Promise<void> | void;
    handleSave: (value: Partial<Meal>) => Promise<void> | void;
    meal?: Meal | EditedMeal;
};

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
            await handleSave({ ...meal, meal: value });
        },
        [handleSave, meal],
    );

    const handleMealNoteSave = useCallback(
        async (note: string) => {
            await handleSave({ ...meal, note });
        },
        [handleSave, meal],
    );

    const handleMealNoteDelete = useCallback(async () => {
        await handleSave({ ...meal, note: null });
    }, [handleSave, meal]);

    const handleMealRatingSave = useCallback(
        async (rating: number) => {
            await handleSave({ ...meal, rating });
        },
        [handleSave, meal],
    );

    const handleMealRatingDelete = useCallback(async () => {
        await handleSave({ ...meal, rating: null });
    }, [handleSave, meal]);

    const handleEditClick = useCallback(() => {
        modals.openModal({
            title: t('edit_meal'),
            centered: true,
            children: (
                <MealModal
                    handleSave={handleMealSave}
                    initialMeal={meal?.meal ?? ''}
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
                    <Tooltip
                        withArrow
                        label={t('tooltip.edit')}
                        position={shouldShowColumnLayout ? 'left' : 'top'}
                    >
                        <ActionIcon
                            {...commonButtonProps}
                            title={t('edit')}
                            onClick={handleEditClick}
                        >
                            <EditPencil />
                        </ActionIcon>
                    </Tooltip>
                    {isMealSaved && (
                        <>
                            <Tooltip
                                withArrow
                                label={t('tooltip.edit_note')}
                                position="right"
                            >
                                <ActionIcon
                                    {...commonButtonProps}
                                    title={t('edit')}
                                    onClick={handleNoteClick}
                                >
                                    <Notes />
                                </ActionIcon>
                            </Tooltip>
                            <Tooltip
                                withArrow
                                label={t('tooltip.rate')}
                                position="left"
                            >
                                <ActionIcon
                                    {...commonButtonProps}
                                    title={t('modals.meal_rate.title')}
                                    onClick={handleRateClick}
                                >
                                    <ThreeStars />
                                </ActionIcon>
                            </Tooltip>
                        </>
                    )}
                    {mealHasContent && (
                        <CopyButton value={meal.meal} tooltipPosition="right" />
                    )}
                </SimpleGrid>
            </Center>
        </Overlay>
    );
};
