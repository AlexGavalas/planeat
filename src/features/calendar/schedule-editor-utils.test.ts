import { type WeeklyMealZone } from '~types/meal-zone';

import { getDuplicateTimes, normalizeSchedule } from './schedule-editor-utils';

const zone = (
    zoneKey: string,
    time: string,
    day = '2026-01-12',
): WeeklyMealZone => ({
    day,
    label: ` ${zoneKey} `,
    position: 9,
    time,
    weekStart: '2026-01-12',
    zoneKey,
});

describe('schedule editor rules', () => {
    it('normalizes days and times without mutating the draft', () => {
        const draft = [
            zone('late', '18:00'),
            zone('tomorrow', '08:00', '2026-01-13'),
            zone('early', '08:00'),
        ];
        const original = structuredClone(draft);
        const normalized = normalizeSchedule(draft, [
            { timestamp: new Date('2026-01-12T00:00:00Z') },
            { timestamp: new Date('2026-01-13T00:00:00Z') },
        ]);

        expect(normalized).toStrictEqual([
            { ...draft[2], label: 'early', position: 0 },
            { ...draft[0], label: 'late', position: 1 },
            { ...draft[1], label: 'tomorrow', position: 0 },
        ]);
        expect(draft).toStrictEqual(original);
    });

    it('reports each duplicate time only once', () => {
        expect(
            getDuplicateTimes([
                zone('one', '08:00'),
                zone('two', '08:00'),
                zone('three', '08:00'),
                zone('four', '12:00'),
            ]),
        ).toStrictEqual(new Set(['08:00']));
    });

    it('does not report unique times', () => {
        expect(
            getDuplicateTimes([zone('one', '08:00'), zone('two', '12:00')]),
        ).toStrictEqual(new Set());
    });
});
