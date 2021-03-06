import { Timeline, Text, Spoiler } from '@mantine/core';
import { format, set, isAfter } from 'date-fns';
import { CrackedEgg, OrangeSliceAlt, AppleHalf, Bbq } from 'iconoir-react';
import { useTranslation } from 'next-i18next';

import { ROWS } from './calendar/constants';

const MEAL_ICON = {
    morning: CrackedEgg,
    snack1: AppleHalf,
    lunch: OrangeSliceAlt,
    snack2: AppleHalf,
    dinner: Bbq,
};

const NOW = new Date();

const MEAL_TIMES = {
    morning: set(NOW, { hours: 9, minutes: 0, seconds: 0 }),
    snack1: set(NOW, { hours: 11, minutes: 0, seconds: 0 }),
    lunch: set(NOW, { hours: 13, minutes: 0, seconds: 0 }),
    snack2: set(NOW, { hours: 17, minutes: 0, seconds: 0 }),
    dinner: set(NOW, { hours: 20, minutes: 0, seconds: 0 }),
};

const d = set(NOW, { hours: 11, minutes: 32, seconds: 0 });

export const DailyMeal = ({ dailyMeals }: { dailyMeals: MealsMap }) => {
    const { t } = useTranslation();

    const translatedRows = ROWS.map((row) => ({
        ...row,
        label: t(`row.${row.key}`),
    }));

    const activeIndex =
        ROWS.findIndex(({ key }) => isAfter(MEAL_TIMES[key], new Date())) - 1;

    return (
        <>
            <Text align="center" pb={20} weight="bold">
                {t('day_plan')}
            </Text>
            <Timeline
                active={activeIndex < 0 ? ROWS.length : activeIndex}
                bulletSize={40}
            >
                {translatedRows.map((row, index) => {
                    const key = `${row.key}_${format(
                        new Date(),
                        'EEE dd/MM/yyyy'
                    )}`;

                    const meal = dailyMeals[key]?.meal || 'N/A';

                    const Icon = MEAL_ICON[row.key];

                    // const nextMeal = index === activeIndex + 1;

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
