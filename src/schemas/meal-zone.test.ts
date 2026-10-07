import { DEFAULT_MEAL_ZONE_TIMES } from '~constants/calendar';

import { mealZoneTimesSchema } from './meal-zone';

describe('mealZoneTimesSchema', () => {
    it('accepts ordered times', () => {
        expect(
            mealZoneTimesSchema.safeParse({
                ...DEFAULT_MEAL_ZONE_TIMES,
                snack1: '10:30',
            }).success,
        ).toBe(true);
    });

    it('rejects equal adjacent zones', () => {
        expect(
            mealZoneTimesSchema.safeParse({
                ...DEFAULT_MEAL_ZONE_TIMES,
                lunch: '10:00',
                snack1: '10:00',
            }).success,
        ).toBe(false);
    });

    it('rejects malformed and out-of-order times', () => {
        expect(
            mealZoneTimesSchema.safeParse({
                ...DEFAULT_MEAL_ZONE_TIMES,
                lunch: '10:30',
                snack1: '11:00',
            }).success,
        ).toBe(false);

        expect(
            mealZoneTimesSchema.safeParse({
                ...DEFAULT_MEAL_ZONE_TIMES,
                morning: '24:00',
            }).success,
        ).toBe(false);
    });
});
