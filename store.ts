import { add, addWeeks, format, parse, parseISO, subWeeks } from 'date-fns';
import { set, omit } from 'lodash/fp';
import { atom, useAtom } from 'jotai';
import { useCallback } from 'react';

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

const currentWeekAtom = atom(new Date());
const unsavedChangesAtom = atom<Record<string, EditedMeal>>({});

export const useCurrentWeek = () => {
    const [currentWeek, setCurrentWeek] = useAtom(currentWeekAtom);

    const nextWeek = useCallback(() => {
        setCurrentWeek((prevWeek) => addWeeks(prevWeek, 1));
    }, []);

    const previousWeek = useCallback(() => {
        setCurrentWeek((prevWeek) => subWeeks(prevWeek, 1));
    }, []);

    return {
        currentWeek,
        nextWeek,
        previousWeek,
    };
};

export const useUnsavedChanges = () => {
    const [unsavedChanges, setUnsavedChanges] = useAtom(unsavedChangesAtom);

    const addChange = useCallback((meal: Meal | EditedMeal) => {
        setUnsavedChanges((prevChanges) =>
            set(meal.section_key, meal, prevChanges)
        );
    }, []);

    const removeChange = useCallback((key: string) => {
        setUnsavedChanges((prevChanges) => omit(key, prevChanges));
    }, []);

    const removeChanges = useCallback(() => {
        setUnsavedChanges({});
    }, []);

    return {
        unsavedChanges,
        addChange,
        removeChange,
        removeChanges,
    };
};

export const useWeeklyScheduleOps = () => {
    const { nextWeek } = useCurrentWeek();
    const { addChange } = useUnsavedChanges();

    const copyToNextWeek = useCallback((meals: Meal[]) => {
        nextWeek();
        Object.values(cloneState(meals)).forEach((meal) => {
            addChange(meal);
        });
    }, []);

    return {
        copyToNextWeek,
    };
};
