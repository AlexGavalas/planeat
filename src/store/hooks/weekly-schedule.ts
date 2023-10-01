import { add, format, parse, parseISO } from 'date-fns';
import { useCallback } from 'react';

import { type EditedMeal, type Meal, type MealsMap } from '~types/meal';

import { useCurrentWeek } from './current-week';
import { useUnsavedChanges } from './unsaved-changes';

const cloneState = (
    meals: (EditedMeal | Meal)[],
): Record<string, EditedMeal> => {
    return meals.reduce((acc: MealsMap, meal) => {
        const newKey = meal.section_key.replace(/(\d+\/\d+\/\d+)$/, (match) => {
            const prevDate = parse(match, 'dd/MM/yyyy', new Date());
            const nextDate = add(prevDate, { weeks: 1 });

            return format(nextDate, 'dd/MM/yyyy');
        });

        const day = format(
            add(parseISO(meal.day), { weeks: 1 }),
            'yyyy-MM-dd HH:mm',
        );

        acc[newKey] = {
            ...meal,
            day,
            section_key: newKey,
        };

        delete acc[newKey].id;

        return acc;
    }, {});
};

type CopyToNextWeek = (meals: (EditedMeal | Meal)[]) => void;

export const useWeeklyScheduleOps = (): {
    copyToNextWeek: CopyToNextWeek;
} => {
    const { nextWeek } = useCurrentWeek();
    const { addChange } = useUnsavedChanges();

    const copyToNextWeek = useCallback<CopyToNextWeek>(
        (meals) => {
            nextWeek();

            Object.values(cloneState(meals)).forEach(addChange);
        },
        [addChange, nextWeek],
    );

    return {
        copyToNextWeek,
    };
};
