import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import { set, omit, partition } from 'lodash/fp';
import { atom, useAtom } from 'jotai';
import { useCallback } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useNotifications } from '@mantine/notifications';

import {
    add,
    addWeeks,
    endOfISOWeek,
    format,
    parse,
    parseISO,
    startOfISOWeek,
    subWeeks,
} from 'date-fns';

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

export const useMeals = () => {
    const { currentWeek } = useCurrentWeek();
    const { unsavedChanges, removeChanges } = useUnsavedChanges();
    const queryClient = useQueryClient();
    const notifications = useNotifications();

    const { data: meals = [], isFetching: fetchingMeals } = useQuery(
        ['meals', currentWeek],
        async () => {
            return supabaseClient
                .from<Meal>('meals')
                .select('*')
                .gte('day', startOfISOWeek(currentWeek).toISOString())
                .lte('day', endOfISOWeek(currentWeek).toISOString());
        },
        {
            select: ({ data }) => data || [],
        }
    );

    const savePlan = async () => {
        // The edited meals will have the id from the db
        const [editedMeals, newMeals] = partition(
            'id',
            Object.values(unsavedChanges)
        );

        const { error: updateError } = await supabaseClient
            .from<EditedMeal>('meals')
            .upsert(editedMeals);

        const { error: createError } = await supabaseClient
            .from<EditedMeal>('meals')
            .insert(newMeals);

        // TODO: Handle errors
        if (!updateError && !createError) {
            queryClient.invalidateQueries(['meals', currentWeek]);
            removeChanges();

            notifications.showNotification({
                title: 'Success',
                message: 'Your changes have been saved',
                color: 'green',
            });
        }
    };

    const revert = () => {
        removeChanges();
    };

    return {
        meals,
        fetchingMeals,
        savePlan,
        revert,
    };
};
