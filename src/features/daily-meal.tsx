'use client';

import { Spoiler, Stack, Text, Timeline, Title } from '@mantine/core';
import { format, isAfter, parseISO, set, startOfDay } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { MEAL_ICON, ROWS } from '~constants/calendar';
import { type MealsMap } from '~types/meal';

type DailyMealProps = Readonly<{
    dailyMeals: MealsMap;
    date: string;
}>;

export const DailyMeal = ({ dailyMeals, date }: DailyMealProps) => {
    const now = parseISO(date);
    const start = startOfDay(now);

    const mealTimes: Record<RowKey, Date> = {
        dinner: set(start, { hours: 20 }),
        lunch: set(start, { hours: 13 }),
        morning: set(start, { hours: 9 }),
        snack1: set(start, { hours: 11 }),
        snack2: set(start, { hours: 17 }),
    };

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
                            title={<Text fw="bold">{row.label}</Text>}
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
