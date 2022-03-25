import { Timeline, Text } from '@mantine/core';
import format from 'date-fns/format';
import { CrackedEgg, OrangeSliceAlt, AppleHalf, Bbq } from 'iconoir-react';

import { ROWS } from './calendar/constants';

const MEAL_ICON = {
    Morning: CrackedEgg,
    'Snack 1': AppleHalf,
    'Snack 2': AppleHalf,
    Lunch: OrangeSliceAlt,
    Dinner: Bbq,
};

export const DailyMeal = ({ dailyMeals }: { dailyMeals: MealsMap }) => {
    return (
        <>
            <Text align="center" pb={20} weight="bold">
                Meals of the day
            </Text>
            <Timeline active={1} bulletSize={40}>
                {ROWS.map((row) => {
                    const key = `${row}_${format(
                        new Date(),
                        'EEE dd/MM/yyyy'
                    )}`;

                    const meal = dailyMeals[key]?.meal || 'N/A';

                    const Icon = MEAL_ICON[row];

                    return (
                        <Timeline.Item
                            key={key}
                            title={<Text weight="bold">{row}</Text>}
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
