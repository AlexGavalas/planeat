import { type MealZoneKey } from '~types/meal-zone';

declare global {
    type RowKey = MealZoneKey;
    type RowItem = {
        key: MealZoneKey;
    };
}

export {};
