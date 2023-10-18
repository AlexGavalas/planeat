import { Badge, Box, Center, Text } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { MultiplePages } from 'iconoir-react';
import { useTranslation } from 'next-i18next';

import { useProfile } from '~hooks/use-profile';
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
            <Box
                className={styles.cell}
                style={{
                    ...(hasNote && { gridTemplateRows: 'auto 1fr' }),
                    ...(isEdited && { border: '2px solid orange' }),
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
                    <Text p={5} ta="center">
                        {meal?.meal || 'N/A'}
                    </Text>
                </Center>
            </Box>
        </Box>
    );
};
