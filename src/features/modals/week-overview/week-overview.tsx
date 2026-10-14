import { Alert, List, Stack, Text } from '@mantine/core';
import { type ContextModalProps } from '@mantine/modals';
import { format, parse, parseISO } from 'date-fns';
import { AppleHalf } from 'iconoir-react';
import groupBy from 'lodash/fp/groupBy';
import { useTranslation } from 'react-i18next';

import { MEAL_ICON } from '~constants/calendar';
import { useWeeklyMealZones } from '~hooks/use-weekly-meal-zones';
import { useCurrentWeek, useMeals } from '~store/hooks';
import { type Meal } from '~types/meal';

const MAX_RATING = 5;
const DATE_PARSE_REFERENCE = new Date(0);

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
    const { currentWeek } = useCurrentWeek();
    const { meals } = useMeals(ownerUserId);
    const { zones } = useWeeklyMealZones(currentWeek, undefined, ownerUserId);
    const zonesByKey = Object.fromEntries(
        zones.map((zone) => [zone.zoneKey, zone]),
    );

    const mealsMap = groupByDay(meals);

    const sortedKeys = Object.keys(mealsMap).sort((a, b) => {
        const d1 = parse(a, 'EEE dd/MM/yyyy', DATE_PARSE_REFERENCE).getTime();
        const d2 = parse(b, 'EEE dd/MM/yyyy', DATE_PARSE_REFERENCE).getTime();

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
                                    return (
                                        (zonesByKey[mealA.section_key]
                                            ?.position ?? 0) -
                                        (zonesByKey[mealB.section_key]
                                            ?.position ?? 0)
                                    );
                                })
                                .map((meal) => {
                                    const zone = zonesByKey[meal.section_key];

                                    if (!zone) {
                                        return null;
                                    }

                                    const Icon = zone.legacyKey
                                        ? MEAL_ICON[zone.legacyKey]
                                        : AppleHalf;

                                    return (
                                        <List.Item
                                            key={meal.id}
                                            icon={<Icon />}
                                        >
                                            <Text fw={600} size="sm">
                                                {zone.label} · {zone.time}
                                            </Text>
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
