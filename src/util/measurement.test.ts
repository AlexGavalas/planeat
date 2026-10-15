import { getMeasurementSummary } from './measurement';

describe('measurement summary', () => {
    it('represents missing history without fabricated timeline points', () => {
        expect(getMeasurementSummary([], [])).toStrictEqual({
            currentFat: 0,
            currentWeight: 0,
            fatTimeline: null,
            weightTimeline: null,
        });
    });

    it('keeps chronological points and uses the latest measurements', () => {
        expect(
            getMeasurementSummary(
                [
                    { date: '2026-01-12', weight: 80 },
                    { date: '2026-01-13', weight: 79 },
                ],
                [
                    { date: '2026-01-12', fat_percentage: 20 },
                    { date: '2026-01-13', fat_percentage: null },
                ],
            ),
        ).toStrictEqual({
            currentFat: 0,
            currentWeight: 79,
            fatTimeline: [
                { x: '2026-01-12', y: 20 },
                { x: '2026-01-13', y: null },
            ],
            weightTimeline: [
                { x: '2026-01-12', y: 80 },
                { x: '2026-01-13', y: 79 },
            ],
        });
    });
});
