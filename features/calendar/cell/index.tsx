import { useModals } from '@mantine/modals';
import { useUser } from '@supabase/supabase-auth-helpers/react';
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import { useQueryClient } from 'react-query';
import { Box, Text, Center } from '@mantine/core';
import { useHover } from '@mantine/hooks';

import { useCurrentWeek, useUnsavedChanges } from '@store/hooks';
import { CellOverlay } from './overlay';

import styles from './cell.module.css';

export const Cell = ({
    id,
    meal,
    timestamp,
    isEdited,
    isRow,
    daysOfWeek,
    row,
    mealsMap,
}: CellProps) => {
    const { user } = useUser();
    const { hovered, ref } = useHover();
    const queryClient = useQueryClient();

    const { currentWeek } = useCurrentWeek();
    const { addChange, removeChange } = useUnsavedChanges();

    const modals = useModals();

    const handleSave = async (value: string) => {
        if (!user) return;

        if (isRow && daysOfWeek && mealsMap) {
            for (const { timestamp, label } of daysOfWeek) {
                const key = `${row}_${label}`;

                const meal = mealsMap[key];

                const editedMeal = {
                    ...meal,
                    meal: value,
                    section_key: key,
                    user_id: user.id,
                    day: timestamp.toISOString(),
                };

                addChange(editedMeal);
            }

            return;
        }

        const editedMeal = {
            ...meal,
            meal: value,
            section_key: id,
            user_id: user.id,
            day: timestamp.toISOString(),
        };

        addChange(editedMeal);
    };

    const handleDelete = async () => {
        if (!meal) return;

        if (isRow && daysOfWeek) {
            for (const { label } of daysOfWeek) {
                removeChange(`${row}_${label}`);
            }
        } else {
            removeChange(id);
        }

        if (!meal.id) return;

        if (isRow && daysOfWeek) {
            for (const { label } of daysOfWeek) {
                await supabaseClient
                    .from('meals')
                    .delete()
                    .eq('section_key', `${row}_${label}`);
            }
        } else {
            await supabaseClient.from('meals').delete().eq('id', meal.id);
        }

        queryClient.invalidateQueries(['meals', currentWeek]);
        modals.closeAll();
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
                <Center>
                    <Text p={5}>{meal?.meal || 'N/A '}</Text>
                </Center>
            </Box>
        </Box>
    );
};
