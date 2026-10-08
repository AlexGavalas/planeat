import { Alert, List, Stack, Text } from '@mantine/core';
import { type ContextModalProps } from '@mantine/modals';
import { format, parse, parseISO } from 'date-fns';
import groupBy from 'lodash/fp/groupBy';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { MEAL_ICON, ROWS } from '~constants/calendar';
import { useMeals } from '~store/hooks';
import { type Meal } from '~types/meal';

const MAX_RATING = 5;

const groupByDay = groupBy<Meal>((item) =>
    format(parseISO(item.day), 'EEE dd/MM/yyyy'),
);

type WeekOverviewModalProps = {
    ownerUserId?: number;
};

export const WeekOverviewModal = ({
    innerProps: { ownerUserId },
}: ContextModalProps<WeekOverviewModalProps>) => {
    const { t } = useTranslation();
    const { meals } = useMeals(ownerUserId);

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
                        <Text
                            c="success.9"
                            fw="var(--mantine-font-weight-medium)"
                            fz="lg"
                        >
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
                                        >
                                            {meal.meal}
                                            {meal.note && (
                                                <Alert
                                                    p="xs"
                                                    title={t('note')}
                                                    variant="outline"
                                                >
                                                    <Text>{meal.note}</Text>
                                                </Alert>
                                            )}
                                            {meal.rating && (
                                                <div>
                                                    <Text
                                                        span
                                                        fw="var(--mantine-font-weight-medium)"
                                                    >
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
