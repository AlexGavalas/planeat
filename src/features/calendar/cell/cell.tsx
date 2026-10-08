import { Badge, Box, Center, Text } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { MultiplePages } from 'iconoir-react';
import { useTranslation } from 'react-i18next';

import {
    useCanEditMealAnnotations,
    useMealPlanOwnerId,
} from '~features/meal-plan-owner';
import { useMeals } from '~store/hooks';
import { type EditedMeal, type Meal } from '~types/meal';

import styles from './cell.module.css';
import { CellOverlay } from './overlay';

export type CellProps = Readonly<{
    id: string;
    meal?: Meal | EditedMeal;
    timestamp: Date;
    isEdited: boolean;
    isRow: boolean;
}>;

export const Cell = ({ id, meal, timestamp, isEdited, isRow }: CellProps) => {
    const { t } = useTranslation();
    const ownerUserId = useMealPlanOwnerId();
    const canEditAnnotations = useCanEditMealAnnotations();
    const { hovered: isHovered, ref } = useHover();

    const { deleteEntryCell, deleteEntryRow, saveEntryCell, saveEntryRow } =
        useMeals();

    const handleSave = (newMeal: Partial<Meal>) => {
        if (!ownerUserId || !newMeal.meal) {
            return;
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
    };

    const handleDelete = () => {
        if (!meal) {
            return;
        }

        if (isRow) {
            deleteEntryRow(id);
        } else {
            deleteEntryCell({ meal });
        }
    };

    const hasNote = !!meal?.note;

    return (
        <Box
            ref={ref}
            style={{
                position: 'relative',
                ...(isRow && { gridColumn: 'span 7' }),
            }}
        >
            {isHovered && (
                <CellOverlay
                    canEditAnnotations={canEditAnnotations}
                    meal={meal}
                    onDelete={handleDelete}
                    onSave={handleSave}
                    ownerUserId={ownerUserId}
                />
            )}
            <Box
                className={styles.cell}
                style={{
                    ...(hasNote && { gridTemplateRows: 'auto 1fr' }),
                    ...(isEdited && {
                        border: '2px solid var(--app-color-state-modified)',
                    }),
                }}
            >
                {hasNote && (
                    <Badge
                        fullWidth
                        leftSection={<MultiplePages fontSize="90%" />}
                        size="xs"
                        variant="light"
                    >
                        {t('note')}
                    </Badge>
                )}
                <Center
                    style={{
                        ...(isHovered && { opacity: 0.15 }),
                    }}
                >
                    <Text p="var(--app-space-calendar-cell)" ta="center">
                        {meal?.meal || 'N/A'}
                    </Text>
                </Center>
            </Box>
        </Box>
    );
};
