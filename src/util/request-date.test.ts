import { resolveRequestDate } from './request-date';

const fallbackDate = new Date('2026-06-01T09:00:00.000Z');
const now = (): Date => fallbackDate;

describe('resolveRequestDate', () => {
    it('uses the configured server date before a request header', () => {
        expect(
            resolveRequestDate({
                allowHeaderDate: true,
                environmentDate: '2026-01-12T12:00:00.000Z',
                headerDate: '2026-02-01T12:00:00.000Z',
                now,
            }),
        ).toStrictEqual(new Date('2026-01-12T12:00:00.000Z'));
    });

    it('uses the request header for preview E2E requests', () => {
        expect(
            resolveRequestDate({
                allowHeaderDate: true,
                headerDate: '2026-01-12T12:00:00.000Z',
                now,
            }),
        ).toStrictEqual(new Date('2026-01-12T12:00:00.000Z'));
    });

    it('ignores the request header outside preview', () => {
        expect(
            resolveRequestDate({
                allowHeaderDate: false,
                headerDate: '2026-01-12T12:00:00.000Z',
                now,
            }),
        ).toBe(fallbackDate);
    });

    it('falls back to the current date for an invalid override', () => {
        expect(
            resolveRequestDate({
                allowHeaderDate: true,
                headerDate: 'not-a-date',
                now,
            }),
        ).toBe(fallbackDate);
    });
});
