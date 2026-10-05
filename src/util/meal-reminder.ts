import { TZDate } from '@date-fns/tz';
import { addDays, format, set } from 'date-fns';

export const getNextReminderAt = ({
    now = new Date(),
    time,
    timezone,
}: {
    now?: Date;
    time: string;
    timezone: string;
}): Date => {
    const localNow = new TZDate(now, timezone);
    const [hours, minutes] = time.split(':').map(Number);
    let next = set(localNow, {
        hours,
        milliseconds: 0,
        minutes,
        seconds: 0,
    });

    if (next <= now) {
        next = addDays(next, 1);
    }

    return new Date(next);
};

export const getTomorrowInTimeZone = (now: Date, timezone: string): string => {
    const localNow = new TZDate(now, timezone);
    return format(addDays(localNow, 1), 'yyyy-MM-dd');
};

export const getLocalDateInTimeZone = (now: Date, timezone: string): string =>
    format(new TZDate(now, timezone), 'yyyy-MM-dd');
