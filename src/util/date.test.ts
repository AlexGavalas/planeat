import { getDaysOfWeek, getUTCDateV2 } from './date';

describe('getDaysOfWeek', () => {
    beforeAll(() => {
        jest.useFakeTimers({
            now: new Date('2023-09-01T00:00:00.000Z'),
        });
    });

    it('returns an array of days of the week', () => {
        const days = getDaysOfWeek(new Date());

        expect(days).toStrictEqual([
            {
                label: 'Mon 28/08/2023',
                timestamp: new Date('2023-08-27T21:00:00.000Z'),
            },
            {
                label: 'Tue 29/08/2023',
                timestamp: new Date('2023-08-28T21:00:00.000Z'),
            },
            {
                label: 'Wed 30/08/2023',
                timestamp: new Date('2023-08-29T21:00:00.000Z'),
            },
            {
                label: 'Thu 31/08/2023',
                timestamp: new Date('2023-08-30T21:00:00.000Z'),
            },
            {
                label: 'Fri 01/09/2023',
                timestamp: new Date('2023-08-31T21:00:00.000Z'),
            },
            {
                label: 'Sat 02/09/2023',
                timestamp: new Date('2023-09-01T21:00:00.000Z'),
            },
            {
                label: 'Sun 03/09/2023',
                timestamp: new Date('2023-09-02T21:00:00.000Z'),
            },
        ]);
    });
});

describe('getUTCDate', () => {
    beforeAll(() => {
        jest.useFakeTimers({
            now: new Date('2023-09-01T00:00:00.000Z'),
        });
    });

    it('returns a date in UTC', () => {
        const date = getUTCDateV2(new Date(), 'yyyy-MM-dd HH:mm:ss');

        expect(date).toBe('2023-09-01 00:00:00');
    });
});
