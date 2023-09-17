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
    const { hovered, ref } = useHover();

    const { deleteEntryCell, deleteEntryRow, saveEntryCell, saveEntryRow } =
        useMeals();

    const handleSave = async (newMeal: Partial<Meal>) => {
        if (!profile || !newMeal.meal) {
            return;
        }

        if (isRow) {
            saveEntryRow({
                sectionKey: id,
                userId: profile.id,
                value: newMeal.meal,
                note: newMeal.note,
                rating: newMeal.rating,
            });
        } else {
            saveEntryCell({
                meal,
                sectionKey: id,
                timestamp,
                userId: profile.id,
                value: newMeal.meal,
                note: newMeal.note,
                rating: newMeal.rating,
            });
        }
    };

    const handleDelete = async () => {
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
            {hovered && (
                <CellOverlay
                    handleDelete={handleDelete}
                    handleSave={handleSave}
                    meal={meal}
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
                        ...(hovered && { opacity: 0.15 }),
                    }}
                >
                    <Text p={5} align="center">
                        {meal?.meal || 'N/A '}
                    </Text>
                </Center>
            </Box>
        </Box>
    );
};
