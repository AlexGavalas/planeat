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
    onDelete: () => Promise<void> | void;
    onSave: (value: Partial<Meal>) => Promise<void> | void;
    meal?: Meal | EditedMeal;
};

const isSavedMeal = (meal?: Meal | EditedMeal): meal is Meal => {
    return meal?.id !== undefined;
};

const isFilledMeal = (meal?: Meal | EditedMeal): meal is Meal => {
    return Boolean(meal?.meal);
};

const commonButtonProps = {
    size: 'lg',
    variant: 'light',
} satisfies ActionIconProps;

export const CellOverlay = ({ onDelete, onSave, meal }: CellOverlayProps) => {
    const { t } = useTranslation();
    const modals = useModals();

    const isMealSaved = isSavedMeal(meal);
    const isMealFilled = isFilledMeal(meal);

    const handleMealSave = useCallback(
        async (value: string) => {
            await onSave({ ...meal, meal: value });
        },
        [onSave, meal],
    );

    const handleMealNoteSave = useCallback(
        async (note: string) => {
            await onSave({ ...meal, note });
        },
        [onSave, meal],
    );

    const handleMealNoteDelete = useCallback(async () => {
        await onSave({ ...meal, note: null });
    }, [onSave, meal]);

    const handleMealRatingSave = useCallback(
        async (rating: number) => {
            await onSave({ ...meal, rating });
        },
        [onSave, meal],
    );

    const handleMealRatingDelete = useCallback(async () => {
        await onSave({ ...meal, rating: null });
    }, [onSave, meal]);

    const handleEditClick = useCallback(() => {
        modals.openModal({
            centered: true,

            children: (
                <MealModal
                    initialMeal={meal?.meal ?? ''}
                    onDelete={onDelete}
                    onSave={handleMealSave}
                />
            ),
            title: t('edit_meal'),
        });
    }, [onDelete, handleMealSave, meal?.meal, modals, t]);

    const handleNoteClick = useCallback(() => {
        if (!isMealSaved) {
            return;
        }

        modals.openModal({
            centered: true,
            children: (
                <MealNoteModal
                    meal={meal}
                    onDelete={handleMealNoteDelete}
                    onSave={handleMealNoteSave}
                />
            ),
            title: t('notes'),
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
            centered: true,
            children: (
                <MealRatingModal
                    meal={meal}
                    onDelete={handleMealRatingDelete}
                    onSave={handleMealRatingSave}
                />
            ),
            title: t('modals.meal_rate.title'),
        });
    }, [
        handleMealRatingDelete,
        handleMealRatingSave,
        isMealSaved,
        meal,
        modals,
        t,
    ]);

    const shouldShowColumnLayout = isMealSaved || isMealFilled;

    return (
        <Overlay style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
            <Center style={{ height: '100%' }}>
                <SimpleGrid
                    cols={shouldShowColumnLayout ? 2 : 1}
                    spacing={4}
                    verticalSpacing={4}
                >
                    <Tooltip
                        withArrow
                        label={t('generic.actions.edit')}
                        position={shouldShowColumnLayout ? 'left' : 'top'}
                    >
                        <ActionIcon
                            {...commonButtonProps}
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
                                    onClick={handleRateClick}
                                >
                                    <ThreeStars />
                                </ActionIcon>
                            </Tooltip>
                        </>
                    )}
                    {isMealFilled && (
                        <CopyButton tooltipPosition="right" value={meal.meal} />
                    )}
                </SimpleGrid>
            </Center>
        </Overlay>
    );
};
