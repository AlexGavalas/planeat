import { Box, Group, Paper, Stack, Text, UnstyledButton } from '@mantine/core';
import { EditPencil } from 'iconoir-react';
import { useTranslation } from 'react-i18next';

import { MEAL_ICON } from '~constants/calendar';
import {
    useCanEditMealAnnotations,
    useMealPlanOwnerId,
} from '~features/meal-plan-owner';
import { useMeals } from '~store/hooks';
import { type EditedMeal, type Meal } from '~types/meal';
import { useOpenContextModal } from '~util/modal';

import styles from './mobile-content.module.css';
import { MobileMealActions } from './mobile-meal-actions';
import { MobileMealDetails } from './mobile-meal-details';
import { type RowKey } from './types';

type MobileMealProps = Readonly<{
    id: string;
    isEdited: boolean;
    isRow: boolean;
    label: string;
    meal?: Meal | EditedMeal;
    time: string;
    timestamp: Date;
}>;

const isSavedMeal = (meal?: Meal | EditedMeal): meal is Meal =>
    meal?.id !== undefined;

export const MobileMeal = ({
    id,
    isEdited,
    isRow,
    label,
    meal,
    time,
    timestamp,
}: MobileMealProps) => {
    const { t } = useTranslation();
    const ownerUserId = useMealPlanOwnerId();
    const canEditAnnotations = useCanEditMealAnnotations();
    const { deleteEntryCell, deleteEntryRow, saveEntryCell, saveEntryRow } =
        useMeals();
    const openEditMealModal = useOpenContextModal('meal');
    const openMealNoteModal = useOpenContextModal('meal-note');
    const openMealRatingModal = useOpenContextModal('meal-rating');
    const [rowKey] = id.split('_');
    const Icon = MEAL_ICON[rowKey as RowKey];

    const handleSave = (newMeal: Partial<Meal>): Promise<void> => {
        if (!ownerUserId || !newMeal.meal) {
            return Promise.resolve();
        }

        if (isRow) {
            saveEntryRow({
                note: newMeal.note,
                rating: newMeal.rating,
                sectionKey: id,
                userId: ownerUserId,
                value: newMeal.meal,
            });
        } else {
            saveEntryCell({
                meal,
                note: newMeal.note,
                rating: newMeal.rating,
                sectionKey: id,
                timestamp,
                userId: ownerUserId,
                value: newMeal.meal,
            });
        }

        return Promise.resolve();
    };

    const handleDelete = (): void => {
        if (!meal) {
            return;
        }
        if (isRow) {
            deleteEntryRow(id);
        } else {
            deleteEntryCell({ meal });
        }
    };

    const handleOpenEdit = (): void => {
        openEditMealModal({
            centered: true,
            innerProps: {
                initialMeal: meal?.meal ?? '',
                onDelete: handleDelete,
                onSave: (value: string) => handleSave({ ...meal, meal: value }),
                ownerUserId,
            },
            size: 'lg',
            title: t('edit_meal'),
        });
    };

    const handleOpenNote = (): void => {
        if (!isSavedMeal(meal)) {
            return;
        }
        openMealNoteModal({
            centered: true,
            innerProps: {
                meal,
                onDelete: () => handleSave({ ...meal, note: null }),
                onSave: (note: string) => handleSave({ ...meal, note }),
            },
            title: t('notes'),
        });
    };

    const handleOpenRating = (): void => {
        if (!isSavedMeal(meal)) {
            return;
        }
        openMealRatingModal({
            centered: true,
            innerProps: {
                meal,
                onDelete: () => handleSave({ ...meal, rating: null }),
                onSave: (rating: number) => handleSave({ ...meal, rating }),
            },
            title: t('modals.meal_rate.title'),
        });
    };

    const handleCopyMeal = (): void => {
        if (meal?.meal) {
            void navigator.clipboard.writeText(meal.meal);
        }
    };

    return (
        <Paper
            withBorder
            className={styles.meal}
            data-edited={isEdited || undefined}
            p="md"
        >
            <Group justify="space-between" wrap="nowrap">
                <Group className={styles.mealSummary} gap="md" wrap="nowrap">
                    {Icon && (
                        <Box aria-hidden className={styles.mealIcon}>
                            <Icon />
                        </Box>
                    )}
                    <Stack gap="micro">
                        <Text fw="var(--mantine-font-weight-bold)">
                            {label} · {time}
                        </Text>
                        <Text c={meal?.meal ? undefined : 'dimmed'}>
                            {meal?.meal || 'N/A'}
                        </Text>
                        <MobileMealDetails meal={meal} />
                    </Stack>
                </Group>
                <Group gap="xs" wrap="nowrap">
                    <UnstyledButton
                        aria-label={t('meal_plan.edit_meal_label', { label })}
                        className={styles.actionButton}
                        onClick={handleOpenEdit}
                    >
                        <EditPencil />
                    </UnstyledButton>
                    {meal?.meal && (
                        <MobileMealActions
                            canEditAnnotations={
                                isSavedMeal(meal) && canEditAnnotations
                            }
                            onCopy={handleCopyMeal}
                            onEditNote={handleOpenNote}
                            onEditRating={handleOpenRating}
                        />
                    )}
                </Group>
            </Group>
        </Paper>
    );
};
