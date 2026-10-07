import {
    Badge,
    Box,
    Group,
    Menu,
    Paper,
    Stack,
    Text,
    Title,
    UnstyledButton,
} from '@mantine/core';
import { format, getDay, parseISO } from 'date-fns';
import { Copy, EditPencil, MoreHoriz, Notes, ThreeStars } from 'iconoir-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MEAL_ICON, ROWS } from '~constants/calendar';
import { useMealZoneTimes } from '~hooks/use-meal-zone-times';
import { useProfile } from '~hooks/use-profile';
import { useCurrentWeek, useMeals, useUnsavedChanges } from '~store/hooks';
import { type EditedMeal, type Meal, type MealsMap } from '~types/meal';
import { getDaysOfWeek } from '~util/date';
import { useOpenContextModal } from '~util/modal';

import styles from './mobile-content.module.css';

type MobileMealProps = Readonly<{
    id: string;
    isEdited: boolean;
    isRow: boolean;
    label: string;
    meal?: Meal | EditedMeal;
    time: string;
    timestamp: Date;
}>;

type MobileDayButtonProps = Readonly<{
    date: Date;
    index: number;
    label?: string;
    onSelect: (index: number) => void;
    selected: boolean;
}>;

const MobileDayButton = ({
    date,
    index,
    label,
    onSelect,
    selected,
}: MobileDayButtonProps) => {
    const handleClick = (): void => {
        onSelect(index);
    };

    return (
        <UnstyledButton
            aria-pressed={selected}
            className={styles.dayButton}
            onClick={handleClick}
        >
            <Text fw="var(--mantine-font-weight-bold)" size="sm">
                {label}
            </Text>
            <Text size="sm">{format(date, 'dd/MM')}</Text>
        </UnstyledButton>
    );
};

const isSavedMeal = (meal?: Meal | EditedMeal): meal is Meal =>
    meal?.id !== undefined;

const MobileMeal = ({
    id,
    isEdited,
    isRow,
    label,
    meal,
    time,
    timestamp,
}: MobileMealProps) => {
    const { t } = useTranslation();
    const { profile } = useProfile();
    const { deleteEntryCell, deleteEntryRow, saveEntryCell, saveEntryRow } =
        useMeals();
    const openEditMealModal = useOpenContextModal('meal');
    const openMealNoteModal = useOpenContextModal('meal-note');
    const openMealRatingModal = useOpenContextModal('meal-rating');
    const [rowKey] = id.split('_');
    const Icon = MEAL_ICON[rowKey as RowKey];

    const handleSave = (newMeal: Partial<Meal>): Promise<void> => {
        if (!profile || !newMeal.meal) {
            return Promise.resolve();
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
                        <Group gap="xs">
                            {meal?.note && (
                                <Badge size="xs" variant="light">
                                    {t('note')}
                                </Badge>
                            )}
                            {meal?.rating && (
                                <Badge size="xs" variant="light">
                                    {t('rating')}: {meal.rating}/5
                                </Badge>
                            )}
                        </Group>
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
                        <Menu position="bottom-end" width={180}>
                            <Menu.Target>
                                <UnstyledButton
                                    aria-label={t('meal_plan.more_actions')}
                                    className={styles.actionButton}
                                >
                                    <MoreHoriz />
                                </UnstyledButton>
                            </Menu.Target>
                            <Menu.Dropdown>
                                {isSavedMeal(meal) && (
                                    <>
                                        <Menu.Item
                                            leftSection={<Notes />}
                                            onClick={handleOpenNote}
                                        >
                                            {t('tooltip.edit_note')}
                                        </Menu.Item>
                                        <Menu.Item
                                            leftSection={<ThreeStars />}
                                            onClick={handleOpenRating}
                                        >
                                            {t('tooltip.rate')}
                                        </Menu.Item>
                                    </>
                                )}
                                <Menu.Item
                                    leftSection={<Copy />}
                                    onClick={handleCopyMeal}
                                >
                                    {t('generic.actions.copy')}
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    )}
                </Group>
            </Group>
        </Paper>
    );
};

export const MobileContent = ({
    initialDate,
}: Readonly<{ initialDate: string }>) => {
    const { i18n, t } = useTranslation();
    const { currentWeek } = useCurrentWeek();
    const { times } = useMealZoneTimes(currentWeek);
    const { meals } = useMeals();
    const { unsavedChanges } = useUnsavedChanges();
    const [selectedDay, setSelectedDay] = useState(
        () => (getDay(parseISO(initialDate)) + 6) % 7,
    );
    const daysOfWeek = getDaysOfWeek(currentWeek);
    const localizedDays = getDaysOfWeek(
        currentWeek,
        'EEE',
        i18n.language === 'gr' ? 'gr' : 'en',
    );
    const mealsMap = useMemo(
        () =>
            meals.reduce<MealsMap>((acc, meal) => {
                acc[meal.section_key] = meal;
                return acc;
            }, {}),
        [meals],
    );
    const day = daysOfWeek[selectedDay] ?? daysOfWeek[0];

    if (!day) {
        return null;
    }

    const sharedRows = ROWS.filter(({ key }) =>
        ['morning', 'snack1', 'snack2'].includes(key),
    );
    const dailyRows = ROWS.filter(({ key }) =>
        ['lunch', 'dinner'].includes(key),
    );
    const handleSelectDay = (index: number): void => {
        setSelectedDay(index);
    };

    const renderMeal = (row: RowItem, isRow: boolean) => {
        const sectionDay = isRow ? daysOfWeek[0] : day;

        if (!sectionDay) {
            return null;
        }

        const id = `${row.key}_${sectionDay.label}`;

        return (
            <MobileMeal
                key={row.key}
                id={id}
                isEdited={Boolean(unsavedChanges[id])}
                isRow={isRow}
                label={t(`row.${row.key}`)}
                meal={unsavedChanges[id] ?? mealsMap[id]}
                time={times[row.key]}
                timestamp={sectionDay.timestamp}
            />
        );
    };

    return (
        <Stack gap="lg">
            <div
                aria-label={t('meal_plan.select_day')}
                className={styles.dayPicker}
                role="group"
            >
                {daysOfWeek.map(({ timestamp }, index) => (
                    <MobileDayButton
                        key={timestamp.toISOString()}
                        date={timestamp}
                        index={index}
                        label={localizedDays[index]?.label}
                        onSelect={handleSelectDay}
                        selected={selectedDay === index}
                    />
                ))}
            </div>
            <Stack gap="sm">
                <Title order={3}>{t('meal_plan.every_day')}</Title>
                {sharedRows.map((row) => renderMeal(row, true))}
            </Stack>
            <Stack gap="sm">
                <Title order={3}>
                    {localizedDays[selectedDay]?.label}{' '}
                    {format(day.timestamp, 'dd/MM')}
                </Title>
                {dailyRows.map((row) => renderMeal(row, false))}
            </Stack>
        </Stack>
    );
};
