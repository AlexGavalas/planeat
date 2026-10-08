import { Stack, Title } from '@mantine/core';
import { format, getDay, parseISO } from 'date-fns';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ROWS } from '~constants/calendar';
import { useMealZoneTimes } from '~hooks/use-meal-zone-times';
import { useCurrentWeek, useMeals, useUnsavedChanges } from '~store/hooks';
import { type MealsMap } from '~types/meal';
import { getDaysOfWeek } from '~util/date';

import styles from './mobile-content.module.css';
import { MobileDayButton } from './mobile-day-button';
import { MobileMeal } from './mobile-meal';
import type { RowItem } from './types';

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
    const mealsMap = meals.reduce<MealsMap>((acc, meal) => {
        acc[meal.section_key] = meal;
        return acc;
    }, {});

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
