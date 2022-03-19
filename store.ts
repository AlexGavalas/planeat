import { add, addWeeks, format, parse, parseISO, subWeeks } from 'date-fns';
import { fromPairs, map, omit } from 'lodash';
import create from 'zustand';

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

const NOW = new Date();

export const useStore = create<StoreI>((set) => ({
    currentWeek: NOW,
    unsavedChanges: {},
    addChange: (meal) =>
        set((state) => ({
            unsavedChanges: {
                ...state.unsavedChanges,
                [meal.section_key]: meal,
            },
        })),
    removeChange: (key) =>
        set((state) => ({
            unsavedChanges: omit(state.unsavedChanges, key),
        })),
    removeChanges: () =>
        set(() => ({
            unsavedChanges: {},
        })),
    copyToNextWeek: (meals: Meal[]) =>
        set((state) => {
            const nextWeek = addWeeks(state.currentWeek, 1);

            return {
                currentWeek: nextWeek,
                unsavedChanges: {
                    ...state.unsavedChanges,
                    ...fromPairs(
                        map(cloneState(meals), (item) => [
                            item.section_key,
                            item,
                        ])
                    ),
                },
            };
        }),
    nextWeek: () =>
        set((state) => ({
            currentWeek: addWeeks(state.currentWeek, 1),
        })),
    previousWeek: () =>
        set((state) => ({
            currentWeek: subWeeks(state.currentWeek, 1),
        })),
}));
