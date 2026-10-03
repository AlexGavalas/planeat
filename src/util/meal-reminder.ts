import { addDays, format } from 'date-fns';
import { formatInTimeZone, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

export const getNextReminderAt = ({
    now = new Date(),
    time,
    timezone,
}: {
    now?: Date;
    time: string;
    timezone: string;
}): Date => {
    const localNow = utcToZonedTime(now, timezone);
    const localDate = format(localNow, 'yyyy-MM-dd');
    let next = zonedTimeToUtc(`${localDate}T${time}:00`, timezone);

    if (next <= now) {
        const nextLocalDate = format(addDays(localNow, 1), 'yyyy-MM-dd');
        next = zonedTimeToUtc(`${nextLocalDate}T${time}:00`, timezone);
    }

    return next;
};

export const getTomorrowInTimeZone = (now: Date, timezone: string): string => {
    const localNow = utcToZonedTime(now, timezone);
    return format(addDays(localNow, 1), 'yyyy-MM-dd');
};

export const getLocalDateInTimeZone = (now: Date, timezone: string): string =>
    formatInTimeZone(now, timezone, 'yyyy-MM-dd');
