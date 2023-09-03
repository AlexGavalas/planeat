import { ActionIcon, Center, Overlay } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { EditPencil, Notes } from 'iconoir-react';
import { useTranslation } from 'next-i18next';

import { MealModal } from '~features/modals/meal';
import { MealNoteModal } from '~features/modals/meal-note';

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

    const handleMealNoteSave = async (value: string) => {
        handleSave({ ...meal, note: value });
    };

    const handleMealNoteDelete = async () => {
        handleSave({ ...meal, note: '' });
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
                )}
            </Center>
        </Overlay>
    );
};
