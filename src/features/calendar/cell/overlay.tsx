import { ActionIcon, Center, Overlay } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { EditPencil, Notes, ThreeStars } from 'iconoir-react';
import { useTranslation } from 'next-i18next';

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

export const CellOverlay = ({
    handleDelete,
    handleSave,
    meal,
}: CellOverlayProps) => {
    const { t } = useTranslation();
    const modals = useModals();

    const isMealSaved = isSavedMeal(meal);

    const handleMealSave = async (value: string) => {
        handleSave({ ...meal, meal: value });
    };

    const handleMealNoteSave = async (note: string) => {
        handleSave({ ...meal, note });
    };

    const handleMealNoteDelete = async () => {
        handleSave({ ...meal, note: null });
    };

    const handleMealRatingSave = async (rating: number) => {
        handleSave({ ...meal, rating });
    };

    const handleMealRatingDelete = async () => {
        handleSave({ ...meal, rating: null });
    };

    return (
        <Overlay opacity={0.05}>
            <Center style={{ height: '100%' }}>
                <ActionIcon
                    size="lg"
                    title={t('edit')}
                    onClick={() => {
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
                    }}
                >
                    <EditPencil />
                </ActionIcon>
                {isMealSaved && (
                    <>
                        <ActionIcon
                            size="lg"
                            title={t('edit')}
                            onClick={() => {
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
                            }}
                        >
                            <Notes />
                        </ActionIcon>
                        <ActionIcon
                            title={t('modals.meal_rate.title')}
                            onClick={() => {
                                modals.openModal({
                                    title: t('modals.meal_rate.title'),
                                    centered: true,
                                    children: (
                                        <MealRatingModal
                                            meal={meal}
                                            handleSave={handleMealRatingSave}
                                            handleDelete={
                                                handleMealRatingDelete
                                            }
                                        />
                                    ),
                                });
                            }}
                        >
                            <ThreeStars />
                        </ActionIcon>
                    </>
                )}
            </Center>
        </Overlay>
    );
};
