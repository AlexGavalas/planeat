'use client';

import { Spoiler, Stack, Text, Timeline, Title } from '@mantine/core';
import { format, isAfter, parse, parseISO, startOfDay } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { MEAL_ICON, ROWS } from '~constants/calendar';
import { type MealsMap } from '~types/meal';
import { type MealZoneTimes } from '~types/meal-zone';

import type { RowKey } from './calendar/types';

type DailyMealProps = Readonly<{
    dailyMeals: MealsMap;
    date: string;
    mealZoneTimes: MealZoneTimes;
}>;

export const DailyMeal = ({
    dailyMeals,
    date,
    mealZoneTimes,
}: DailyMealProps) => {
    const now = parseISO(date);
    const start = startOfDay(now);

    const mealTimes = Object.fromEntries(
        ROWS.map(({ key }) => [key, parse(mealZoneTimes[key], 'HH:mm', start)]),
    ) as Record<RowKey, Date>;

    const { t } = useTranslation();

    const translatedRows = ROWS.map((row) => ({
        ...row,
        label: t(`row.${row.key}`),
    }));

    const activeIndex = ROWS.findIndex(({ key }) =>
        isAfter(mealTimes[key], now),
    );

    return (
        <Stack gap="md">
            <Title order={3}>{t('day_plan')}</Title>
            <Timeline
                active={activeIndex < 0 ? ROWS.length : activeIndex}
                bulletSize={40}
            >
                {translatedRows.map((row) => {
                    const key = `${row.key}_${format(now, 'EEE dd/MM/yyyy')}`;

                    const meal = dailyMeals[key]?.meal || 'N/A';

                    const Icon = MEAL_ICON[row.key];

                    return (
                        <Timeline.Item
                            key={key}
                            bullet={<Icon />}
                            title={
                                <Text fw="var(--mantine-font-weight-bold)">
                                    {row.label} · {mealZoneTimes[row.key]}
                                </Text>
                            }
                        >
                            <Spoiler
                                hideLabel={t('generic.actions.show_less')}
                                maxHeight={100}
                                showLabel={t('generic.actions.show_more')}
                            >
                                <Text>{meal}</Text>
                            </Spoiler>
                        </Timeline.Item>
                    );
                })}
            </Timeline>
        </Stack>
    );
};
