import { Box, Center, Text } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { MultiplePages } from 'iconoir-react';

import { useProfile } from '~hooks/use-profile';
import { useMeals } from '~store/hooks';

import styles from './cell.module.css';
import { CellOverlay } from './overlay';

export const Cell = ({ id, meal, timestamp, isEdited, isRow }: CellProps) => {
    const { profile: user } = useProfile();
    const { hovered, ref } = useHover();

    const { deleteEntryCell, deleteEntryRow, saveEntryCell, saveEntryRow } =
        useMeals();

    const handleSave = async (newMeal: Partial<Meal>) => {
        if (!user || !newMeal.meal) {
            return;
        }

        if (isRow) {
            saveEntryRow({
                sectionKey: id,
                userId: user.id,
                value: newMeal.meal,
                note: newMeal.note,
            });
        } else {
            saveEntryCell({
                meal,
                sectionKey: id,
                timestamp,
                userId: user.id,
                value: newMeal.meal,
                note: newMeal.note,
            });
        }
    };

    const handleDelete = async () => {
        if (!meal) {
            return;
        }

        if (isRow) {
            deleteEntryRow({ id, meal });
        } else {
            deleteEntryCell({ id, meal });
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
