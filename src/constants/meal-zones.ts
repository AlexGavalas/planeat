import { type MealZoneKey, type MealZoneTimes } from '~types/meal-zone';

export const MEAL_ZONE_KEYS = [
    'morning',
    'snack1',
    'lunch',
    'snack2',
    'dinner',
] as const satisfies readonly MealZoneKey[];

export const DEFAULT_MEAL_ZONE_TIMES: MealZoneTimes = {
    dinner: '20:00',
    lunch: '13:00',
    morning: '09:00',
    snack1: '11:00',
    snack2: '17:00',
};

export const DEFAULT_MEAL_ZONE_LABELS: Record<MealZoneKey, string> = {
    dinner: 'Dinner',
    lunch: 'Lunch',
    morning: 'Morning',
    snack1: 'Snack',
    snack2: 'Snack',
};
