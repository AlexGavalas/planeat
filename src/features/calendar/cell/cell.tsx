import { Box, Center, Text } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { MultiplePages } from 'iconoir-react';

import { useProfile } from '~hooks/use-profile';
import { useMeals } from '~store/hooks';
import { type EditedMeal, type Meal } from '~types/meal';

import styles from './cell.module.css';
import { CellOverlay } from './overlay';

export type CellProps = {
    id: string;
    meal?: Meal | EditedMeal;
    timestamp: Date;
    isEdited: boolean;
    isRow: boolean;
};

export const Cell = ({ id, meal, timestamp, isEdited, isRow }: CellProps) => {
    const { profile } = useProfile();
    const { hovered: isHovered, ref } = useHover();

    const { deleteEntryCell, deleteEntryRow, saveEntryCell, saveEntryRow } =
        useMeals();

    const handleSave = (newMeal: Partial<Meal>) => {
        if (!profile || !newMeal.meal) {
            return;
        }

        if (isRow) {
            saveEntryRow({
                note: newMeal.note,
                rating: newMeal.rating,
                sectionKey: id,
                userId: profile.id,
                value: newMeal.meal,
            });
        } else {
            saveEntryCell({
                meal,
                note: newMeal.note,
                rating: newMeal.rating,
                sectionKey: id,
                timestamp,
                userId: profile.id,
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
                    meal={meal}
                    onDelete={handleDelete}
                    onSave={handleSave}
                />
            )}
            {hasNote && (
                <Box className={styles.infoContainer}>
                    <MultiplePages />
                </Box>
            )}
            <Box
                className={styles.cell}
                style={{
                    ...(isEdited && { border: '2px solid orange' }),
                }}
            >
                <Center
                    style={{
                        ...(isHovered && { opacity: 0.15 }),
                    }}
                >
                    <Text p={5} ta="center">
                        {meal?.meal || 'N/A'}
                    </Text>
                </Center>
            </Box>
        </Box>
    );
};
