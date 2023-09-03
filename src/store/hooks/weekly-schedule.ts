import { add, format, parse, parseISO } from 'date-fns';
import { useCallback } from 'react';

import { type Meal, type MealsMap } from '~types/meal';

import { useCurrentWeek } from './current-week';
import { useUnsavedChanges } from './unsaved-changes';

const cloneState = (meals: Meal[]) => {
    return meals.reduce((acc: MealsMap, meal) => {
        const newKey = meal.section_key.replace(/(\d+\/\d+\/\d+)$/, (match) => {
            const prevDate = parse(match, 'dd/MM/yyyy', new Date());

            return format(add(prevDate, { weeks: 1 }), 'dd/MM/yyyy');
        });

        acc[newKey] = {
            ...meal,
            day: add(parseISO(meal.day), { weeks: 1 }).toISOString(),
            section_key: newKey,
        };

        delete acc[newKey].id;

        return acc;
    }, {});
};

export const useWeeklyScheduleOps = () => {
    const { nextWeek } = useCurrentWeek();
    const { addChange } = useUnsavedChanges();

    const copyToNextWeek = useCallback(
        (meals: Meal[]) => {
            nextWeek();

            Object.values(cloneState(meals)).forEach(addChange);
        },
        [addChange, nextWeek],
    );

    return {
        copyToNextWeek,
    };
};
