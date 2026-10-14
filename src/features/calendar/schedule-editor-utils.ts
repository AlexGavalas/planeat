import { addMinutes, format, parse } from 'date-fns';

import { type Meal } from '~types/meal';
import { type WeeklyMealZone } from '~types/meal-zone';

export type ScheduleEditorOptions = {
    initialDay: string;
    meals: Meal[];
    onClose: () => void;
    onSave: (zones: WeeklyMealZone[]) => Promise<void>;
    opened: boolean;
    weekStart: string;
    zones: WeeklyMealZone[];
};

export const getNextMealTime = (zones: WeeklyMealZone[]): string => {
    const last = zones.toSorted((a, b) => a.time.localeCompare(b.time)).at(-1);
    if (!last) {
        return '12:00';
    }
    const parsed = parse(last.time, 'HH:mm', new Date(2000, 0, 1));
    const value = format(addMinutes(parsed, 60), 'HH:mm');
    return value === '00:00' ? '23:59' : value;
};
