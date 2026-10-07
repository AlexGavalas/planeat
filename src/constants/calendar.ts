import { AppleHalf, Bbq, CrackedEgg, OrangeSliceAlt } from 'iconoir-react';

import { MEAL_ZONE_KEYS } from '~constants/meal-zones';
import { type MealZoneKey } from '~types/meal-zone';

export { DEFAULT_MEAL_ZONE_TIMES } from './meal-zones';

export type MealZone = {
    key: MealZoneKey;
};

export const ROWS: MealZone[] = MEAL_ZONE_KEYS.map((key) => ({ key }));

export const MEAL_ICON = {
    dinner: Bbq,
    lunch: OrangeSliceAlt,
    morning: CrackedEgg,
    snack1: AppleHalf,
    snack2: AppleHalf,
};
