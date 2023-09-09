import { Spoiler, Text, Timeline, Title } from '@mantine/core';
import { format } from 'date-fns';
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

export const DailyMeal = ({ dailyMeals }: { dailyMeals: MealsMap }) => {
    const { t } = useTranslation();

    const translatedRows = ROWS.map((row) => ({
        ...row,
        label: t(`row.${row.key}`),
    }));

    return (
        <>
            <Title order={3}>{t('day_plan')}</Title>
            <Timeline active={ROWS.length} bulletSize={40}>
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
