import { addDays, format, parseISO } from 'date-fns';

import { type WeeklyMealZone } from '~types/meal-zone';

import { weeklyMealScheduleSchema } from './weekly-meal-zone';

const weekStart = '2026-10-12';

const createZone = (dayOffset: number, position = 0): WeeklyMealZone => ({
    day: format(addDays(parseISO(weekStart), dayOffset), 'yyyy-MM-dd'),
    label: `Meal ${position + 1}`,
    position,
    time: `${String(8 + position).padStart(2, '0')}:00`,
    weekStart,
    zoneKey: `${dayOffset}-${position}`,
});

const createSchedule = (): WeeklyMealZone[] =>
    Array.from({ length: 7 }, (_, day) => createZone(day));

describe('weeklyMealScheduleSchema', () => {
    it('accepts a different valid number of slots for each day', () => {
        const zones = createSchedule().flatMap((zone, day) => [
            zone,
            ...Array.from({ length: day }, (_, position) =>
                createZone(day, position + 1),
            ),
        ]);

        expect(
            weeklyMealScheduleSchema.safeParse({ weekStart, zones }).success,
        ).toBe(true);
    });

    it('rejects days outside the one-to-ten slot limit', () => {
        const missingDay = createSchedule().slice(1);
        const tooMany = [
            ...createSchedule(),
            ...Array.from({ length: 10 }, (_, position) =>
                createZone(0, position + 1),
            ),
        ];

        expect(
            weeklyMealScheduleSchema.safeParse({
                weekStart,
                zones: missingDay,
            }).success,
        ).toBe(false);
        expect(
            weeklyMealScheduleSchema.safeParse({
                weekStart,
                zones: tooMany,
            }).success,
        ).toBe(false);
    });

    it('rejects duplicate times within a day', () => {
        const zones = [
            ...createSchedule(),
            { ...createZone(0, 1), time: '08:00' },
        ];

        expect(
            weeklyMealScheduleSchema.safeParse({ weekStart, zones }).success,
        ).toBe(false);
    });
});
