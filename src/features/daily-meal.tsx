import { Spoiler, Text, Timeline, Title } from '@mantine/core';
import { format, isAfter, set, startOfDay } from 'date-fns';
import { AppleHalf, Bbq, CrackedEgg, OrangeSliceAlt } from 'iconoir-react';
import { useTranslation } from 'next-i18next';

import { type MealsMap } from '~types/meal';
import { getUTCDate } from '~util/date';

import { ROWS } from './calendar/constants';

const MEAL_ICON = {
    morning: CrackedEgg,
    snack1: AppleHalf,
    lunch: OrangeSliceAlt,
    snack2: AppleHalf,
    dinner: Bbq,
};

const now = getUTCDate(new Date());
const startOfDayTimestamp = startOfDay(now);

const MEAL_TIMES = {
    morning: set(startOfDayTimestamp, { hours: 9, minutes: 0, seconds: 0 }),
    snack1: set(startOfDayTimestamp, { hours: 11, minutes: 0, seconds: 0 }),
    lunch: set(startOfDayTimestamp, { hours: 13, minutes: 0, seconds: 0 }),
    snack2: set(startOfDayTimestamp, { hours: 17, minutes: 0, seconds: 0 }),
    dinner: set(startOfDayTimestamp, { hours: 20, minutes: 0, seconds: 0 }),
};

export const DailyMeal = ({ dailyMeals }: { dailyMeals: MealsMap }) => {
    const { t } = useTranslation();

    const translatedRows = ROWS.map((row) => ({
        ...row,
        label: t(`row.${row.key}`),
    }));

    const activeIndex =
        ROWS.findIndex(({ key }) => isAfter(getUTCDate(MEAL_TIMES[key]), now)) -
        1;

    return (
        <>
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
                            title={<Text weight="bold">{row.label}</Text>}
                            bullet={<Icon />}
                        >
                            <Spoiler
                                maxHeight={100}
                                hideLabel={t('hide')}
                                showLabel={t('show_more')}
                            >
                                <Text>{meal}</Text>
                            </Spoiler>
                        </Timeline.Item>
                    );
                })}
            </Timeline>
        </>
    );
};
