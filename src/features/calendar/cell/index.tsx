import { Box, Center, Text } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { useUser } from '@supabase/auth-helpers-react';

import { useMeals } from '~store/hooks';

import styles from './cell.module.css';
import { CellOverlay } from './overlay';

export const Cell = ({ id, meal, timestamp, isEdited, isRow }: CellProps) => {
    const user = useUser();
    const { hovered, ref } = useHover();

    const { deleteEntryCell, deleteEntryRow, saveEntryCell, saveEntryRow } =
        useMeals();

    const handleSave = async (value: string) => {
        if (!user) return;

        if (isRow) {
            saveEntryRow({ sectionKey: id, userId: user.id, value });
        } else {
            saveEntryCell({
                meal,
                sectionKey: id,
                timestamp,
                userId: user.id,
                value,
            });
        }
    };

    const handleDelete = async () => {
        if (!meal) return;

        if (isRow) {
            deleteEntryRow({ id, meal });
        } else {
            deleteEntryCell({ id, meal });
        }
    };

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
