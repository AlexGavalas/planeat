import {
    ActionIcon,
    type ActionIconProps,
    Center,
    Overlay,
    SimpleGrid,
    Tooltip,
} from '@mantine/core';
import { EditPencil, Notes, ThreeStars } from 'iconoir-react';
import { useTranslation } from 'react-i18next';

import { CopyButton } from '~components/copy-button';
import {
    type EditedMeal,
    type EditedMealItem,
    type Meal,
    type MealChange,
} from '~types/meal';
import { useOpenContextModal } from '~util/modal';

type CellOverlayProps = Readonly<{
    canEditAnnotations?: boolean;
    onDelete: () => Promise<void> | void;
    onSave: (value: MealChange) => Promise<void> | void;
    meal?: Meal | EditedMeal;
    ownerUserId?: number;
}>;

const isSavedMeal = (meal?: Meal | EditedMeal): meal is Meal => {
    return meal?.id !== undefined;
};

const isFilledMeal = (meal?: Meal | EditedMeal): meal is Meal => {
    return Boolean(meal?.meal);
};

const commonButtonProps = {
    size: 'lg',
    variant: 'outline',
} satisfies ActionIconProps;

export const CellOverlay = ({
    canEditAnnotations = true,
    onDelete,
    onSave,
    meal,
    ownerUserId,
}: CellOverlayProps) => {
    const { t } = useTranslation();
    const openEditMealModal = useOpenContextModal('meal');
    const openMealNoteModal = useOpenContextModal('meal-note');
    const openMealRatingModal = useOpenContextModal('meal-rating');

    const isMealSaved = isSavedMeal(meal);
    const isMealFilled = isFilledMeal(meal);

    const handleMealSave = async (value: string, items: EditedMealItem[]) => {
        await onSave({ ...meal, items, meal: value });
    };

    const handleMealNoteSave = async (note: string) => {
        await onSave({ ...meal, note });
    };

    const handleMealNoteDelete = async () => {
        await onSave({ ...meal, note: null });
    };

    const handleMealRatingSave = async (rating: number) => {
        await onSave({ ...meal, rating });
    };

    const handleMealRatingDelete = async () => {
        await onSave({ ...meal, rating: null });
    };

    const handleEditClick = () => {
        openEditMealModal({
            centered: true,
            innerProps: {
                initialItems: meal?.items ?? [],
                initialMeal: meal?.meal ?? '',
                onDelete,
                onSave: handleMealSave,
                ownerUserId,
            },
            size: 'lg',
            title: t('edit_meal'),
        });
    };

    const handleNoteClick = () => {
        if (!isMealSaved) {
            return;
        }

        openMealNoteModal({
            centered: true,
            innerProps: {
                meal,
                onDelete: handleMealNoteDelete,
                onSave: handleMealNoteSave,
            },
            title: t('notes'),
        });
    };

    const handleRateClick = () => {
        if (!isMealSaved) {
            return;
        }

        openMealRatingModal({
            centered: true,
            innerProps: {
                meal,
                onDelete: handleMealRatingDelete,
                onSave: handleMealRatingSave,
            },
            title: t('modals.meal_rate.title'),
        });
    };

    const shouldShowColumnLayout = isMealSaved || isMealFilled;

    return (
        <Overlay style={{ background: 'var(--app-color-surface-overlay)' }}>
            <Center style={{ height: '100%' }}>
                <SimpleGrid
                    cols={shouldShowColumnLayout ? 2 : 1}
                    spacing="xxs"
                    verticalSpacing="xxs"
                >
                    <Tooltip
                        withArrow
                        label={t('generic.actions.edit')}
                        position={shouldShowColumnLayout ? 'left' : 'top'}
                    >
                        <ActionIcon
                            {...commonButtonProps}
                            aria-label={t('generic.actions.edit')}
                            onClick={handleEditClick}
                        >
                            <EditPencil />
                        </ActionIcon>
                    </Tooltip>
                    {isMealSaved && canEditAnnotations && (
                        <>
                            <Tooltip
                                withArrow
                                label={t('tooltip.edit_note')}
                                position="right"
                            >
                                <ActionIcon
                                    {...commonButtonProps}
                                    aria-label={t('tooltip.edit_note')}
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
                                    aria-label={t('tooltip.rate')}
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
