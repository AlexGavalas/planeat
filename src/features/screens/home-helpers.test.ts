import { DEFAULT_MEAL_ZONE_TIMES } from '~constants/calendar';

import {
    getFirstName,
    getGreetingPeriod,
    getNextMealIndex,
    getTimelineTrend,
    toSparklinePoints,
} from './home-helpers';

describe('home dashboard helpers', () => {
    it('derives the greeting and first name', () => {
        expect(getFirstName('  Alex Gavalas ')).toBe('Alex');
    });

    it('uses the time of day for the greeting period', () => {
        expect(getGreetingPeriod(8)).toBe('morning');
        expect(getGreetingPeriod(12)).toBe('afternoon');
        expect(getGreetingPeriod(20)).toBe('evening');
    });

    it('finds the next meal from the configured schedule', () => {
        expect(
            getNextMealIndex('2026-01-12T12:00:00', DEFAULT_MEAL_ZONE_TIMES),
        ).toBe(2);
        expect(
            getNextMealIndex('2026-01-12T21:00:00', DEFAULT_MEAL_ZONE_TIMES),
        ).toBe(-1);
    });

    it('summarizes valid timeline points', () => {
        expect(
            getTimelineTrend([
                { x: '2026-01-05', y: 82 },
                { x: '2026-01-08', y: null },
                { x: '2026-01-12', y: 78 },
            ]),
        ).toStrictEqual({
            change: -4,
            current: 78,
            firstDate: '2026-01-05',
            latestDate: '2026-01-12',
            values: [82, 78],
        });
    });

    it('creates bounded sparkline coordinates', () => {
        expect(toSparklinePoints([82, 80, 78])).toBe('0,4 50,14 100,24');
        expect(toSparklinePoints([78])).toBe('');
    });
});
