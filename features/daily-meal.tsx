import { Timeline, Text } from '@mantine/core';
import format from 'date-fns/format';
import { CrackedEgg, OrangeSliceAlt, AppleHalf, Bbq } from 'iconoir-react';
import { useTranslation } from 'next-i18next';

import { ROWS } from './calendar/constants';

const MEAL_ICON = {
    morning: CrackedEgg,
    snack1: AppleHalf,
    snack2: AppleHalf,
    lunch: OrangeSliceAlt,
    dinner: Bbq,
};

export const DailyMeal = ({ dailyMeals }: { dailyMeals: MealsMap }) => {
    const { t } = useTranslation();

    const translatedRows = ROWS.map((row) => ({
        ...row,
        label: t(`row.${row.key}`),
    }));

    return (
        <>
            <Text align="center" pb={20} weight="bold">
                {t('day_plan')}
            </Text>
            <Timeline active={1} bulletSize={40}>
                {translatedRows.map((row) => {
                    const key = `${row.key}_${format(
                        new Date(),
                        'EEE dd/MM/yyyy'
                    )}`;

                    const meal = dailyMeals[key]?.meal || 'N/A';

                    const Icon = MEAL_ICON[row.key];

                    return (
                        <Timeline.Item
                            key={key}
                            title={<Text weight="bold">{row.label}</Text>}
                            bullet={<Icon />}
                        >
                            <Text>{meal}</Text>
                        </Timeline.Item>
                    );
                })}
            </Timeline>
        </>
    );
};
