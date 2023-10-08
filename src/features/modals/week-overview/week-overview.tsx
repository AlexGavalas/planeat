import { Alert, List, Stack, Text } from '@mantine/core';
import { format, parse, parseISO } from 'date-fns';
import groupBy from 'lodash/fp/groupBy';
import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';

import { MEAL_ICON, ROWS } from '~constants/calendar';
import { useMeals } from '~store/hooks';
import { type Meal } from '~types/meal';

const MAX_RATING = 5;

const groupByDay = groupBy<Meal>((item) =>
    format(parseISO(item.day), 'EEE dd/MM/yyyy'),
);

export const WeekOverviewModal = () => {
    const { t } = useTranslation();
    const { meals } = useMeals();

    const mealsMap = useMemo(() => groupByDay(meals), [meals]);

    const sortedKeys = Object.keys(mealsMap).sort((a, b) => {
        const d1 = parse(a, 'EEE dd/MM/yyyy', new Date()).getTime();
        const d2 = parse(b, 'EEE dd/MM/yyyy', new Date()).getTime();

        return d1 - d2;
    });

    return (
        <Stack gap="lg">
            {sortedKeys.map((key) => {
                const dayMeals = mealsMap[key];

                if (!dayMeals?.length || !dayMeals[0]?.day) {
                    return null;
                }

                const timeslot = format(
                    parseISO(dayMeals[0].day),
                    'EEE dd/MM/yyyy',
                );

                return (
                    <Stack key={key} gap="xs">
                        <Text c="green.9" fw={500} fz="lg">
                            {timeslot}
                        </Text>
                        <List spacing="xs">
                            {dayMeals
                                .sort((mealA, mealB) => {
                                    const [rowKeyA] =
                                        mealA.section_key.split('_');

                                    const [rowKeyB] =
                                        mealB.section_key.split('_');

                                    const rowA = ROWS.findIndex(
                                        ({ key }) => key === rowKeyA,
                                    );

                                    const rowB = ROWS.findIndex(
                                        ({ key }) => key === rowKeyB,
                                    );

                                    return rowA - rowB;
                                })
                                .map((meal) => {
                                    const [rowKey] =
                                        meal.section_key.split('_');

                                    const row = ROWS.find(
                                        ({ key }) => key === rowKey,
                                    );

                                    if (!row) {
                                        return null;
                                    }

                                    const Icon = MEAL_ICON[row.key];

                                    return (
                                        <List.Item
                                            key={meal.id}
                                            icon={<Icon />}
                                            style={{
                                                // TODO: Fix this currently Mantine aligns at the center, check after update if it's fixed
                                                '--_item-wrapper-align':
                                                    'flex-start',
                                            }}
                                        >
                                            {meal.meal}
                                            {meal.note && (
                                                <Alert p="xs" title={t('note')}>
                                                    <Text>{meal.note}</Text>
                                                </Alert>
                                            )}
                                            {meal.rating && (
                                                <div>
                                                    <Text span fw={500}>
                                                        {t('rating')}:{' '}
                                                    </Text>
                                                    <Text span>
                                                        {meal.rating} /{' '}
                                                        {MAX_RATING}
                                                    </Text>
                                                </div>
                                            )}
                                        </List.Item>
                                    );
                                })}
                        </List>
                    </Stack>
                );
            })}
        </Stack>
    );
};
