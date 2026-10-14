import { add, format, parse, parseISO } from 'date-fns';

import { useMealPlanOwnerId } from '~features/meal-plan-owner';
import { type EditedMeal, type Meal, type MealsMap } from '~types/meal';
import { type WeeklyMealZone } from '~types/meal-zone';

import { saveWeeklyMealSchedule } from '../../app/weekly-meal-zone-actions';
import { useCurrentWeek } from './current-week';
import { useUnsavedChanges } from './unsaved-changes';

const cloneSectionKey = (key: string): string =>
    key.replace(/(\d+\/\d+\/\d+)$/, (match) => {
        const previousDate = parse(match, 'dd/MM/yyyy', new Date());
        return format(add(previousDate, { weeks: 1 }), 'dd/MM/yyyy');
    });

const cloneState = (
    meals: (EditedMeal | Meal)[],
): Record<string, EditedMeal> => {
    return meals.reduce((acc: MealsMap, meal) => {
        const newKey = cloneSectionKey(meal.section_key);

        const day = format(add(parseISO(meal.day), { weeks: 1 }), 'yyyy-MM-dd');

        acc[newKey] = {
            ...meal,
            day,
            section_key: newKey,
        };

        delete acc[newKey]?.id;

        return acc;
    }, {});
};

type CopyToNextWeek = (meals: (EditedMeal | Meal)[]) => Promise<void>;

export const useWeeklyScheduleOps = (
    zones: WeeklyMealZone[],
): {
    copyToNextWeek: CopyToNextWeek;
} => {
    const { nextWeek } = useCurrentWeek();
    const { addChange } = useUnsavedChanges();
    const ownerUserId = useMealPlanOwnerId();

    const copyToNextWeek: CopyToNextWeek = async (meals) => {
        const nextZones = zones.map((zone) => ({
            ...zone,
            day: format(add(parseISO(zone.day), { weeks: 1 }), 'yyyy-MM-dd'),
            weekStart: format(
                add(parseISO(zone.weekStart), { weeks: 1 }),
                'yyyy-MM-dd',
            ),
            zoneKey: cloneSectionKey(zone.zoneKey),
        }));
        const nextWeekStart = nextZones[0]?.weekStart;
        if (nextWeekStart) {
            const result = await saveWeeklyMealSchedule({
                ...(ownerUserId ? { ownerUserId } : {}),
                weekStart: nextWeekStart,
                zones: nextZones,
            });
            if (!result.ok) {
                return;
            }
        }
        nextWeek();

        Object.values(cloneState(meals)).forEach(addChange);
    };

    return {
        copyToNextWeek,
    };
};
