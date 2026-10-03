import { getNextReminderAt, getTomorrowInTimeZone } from './meal-reminder';

describe('meal reminder scheduling', () => {
    it('schedules the same local day when the reminder time is ahead', () => {
        const result = getNextReminderAt({
            now: new Date('2026-03-28T18:30:00.000Z'),
            time: '20:00',
            timezone: 'Europe/Berlin',
        });

        expect(result.toISOString()).toBe('2026-03-28T19:00:00.000Z');
    });

    it('preserves local time across a daylight-saving transition', () => {
        const result = getNextReminderAt({
            now: new Date('2026-03-28T19:30:00.000Z'),
            time: '20:00',
            timezone: 'Europe/Berlin',
        });

        expect(result.toISOString()).toBe('2026-03-29T18:00:00.000Z');
    });

    it('calculates tomorrow in the user timezone', () => {
        expect(
            getTomorrowInTimeZone(
                new Date('2026-10-01T22:30:00.000Z'),
                'Europe/Berlin',
            ),
        ).toBe('2026-10-03');
    });
});
