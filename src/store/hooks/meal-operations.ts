import { endOfWeek, format, startOfWeek } from 'date-fns';
import { partition } from 'lodash/fp';

import { type EditedMeal, type Meal, type MealsMap } from '~types/meal';

export type DeleteEntryCell = (params: { meal: Meal | EditedMeal }) => void;
export type DeleteEntryRow = (id: string) => void;

export type SaveEntryCell = (params: {
    meal?: Meal | EditedMeal;
    sectionKey: string;
    timestamp: Date;
    userId: number;
    value: string;
    note: EditedMeal['note'];
    rating: EditedMeal['rating'];
}) => void;

export type SaveEntryRow = (params: {
    sectionKey: string;
    userId: number;
    value: string;
    note: EditedMeal['note'];
    rating: EditedMeal['rating'];
}) => void;

export type UseMeals = (explicitOwnerUserId?: number) => {
    meals: Meal[];
    isLoading: boolean;
    savePlan: () => Promise<boolean>;
    revert: () => void;
    deleteEntryCell: DeleteEntryCell;
    deleteEntryRow: DeleteEntryRow;
    saveEntryCell: SaveEntryCell;
    saveEntryRow: SaveEntryRow;
};

type MealPlanChanges = {
    deletedIds: string[];
    editedMeals: EditedMeal[];
    newMeals: EditedMeal[];
    ownerUserId?: number;
};

type WeekRange = {
    endDate: string;
    startDate: string;
};

export const getMealPlanChanges = (
    unsavedChanges: Record<string, Meal | EditedMeal>,
    ownerUserId: number | undefined,
): MealPlanChanges => {
    const [changedMeals, newMeals] = partition(
        'id',
        Object.values(unsavedChanges),
    );
    const [editedMeals, deletedMeals] = partition('meal', changedMeals);

    return {
        deletedIds: deletedMeals.flatMap(({ id }) => (id ? [id] : [])),
        editedMeals,
        newMeals,
        ...(ownerUserId ? { ownerUserId } : {}),
    };
};

export const getMealsMap = (meals: Meal[]): MealsMap =>
    meals.reduce<MealsMap>((result, meal) => {
        result[meal.section_key] = meal;
        return result;
    }, {});

export const getWeekRange = (currentWeek: Date): WeekRange => ({
    endDate: format(endOfWeek(currentWeek, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
    startDate: format(
        startOfWeek(currentWeek, { weekStartsOn: 1 }),
        'yyyy-MM-dd',
    ),
});
