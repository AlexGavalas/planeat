import { eachDayOfInterval, endOfWeek, format, startOfWeek } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import el from 'date-fns/locale/el';
import enGB from 'date-fns/locale/en-GB';

const localeMap = {
    gr: el,
    en: enGB,
};

export const getDaysOfWeek = (
    date: Date,
    formatString = 'EEE dd/MM/yyyy',
    locale: keyof typeof localeMap = 'en',
) => {
    return eachDayOfInterval({
        start: startOfWeek(date, { weekStartsOn: 1 }),
        end: endOfWeek(date, { weekStartsOn: 1 }),
    }).map((day) => ({
        timestamp: day,
        label: format(day, formatString, {
            locale: localeMap[locale],
        }),
    }));
};

export const getUTCDate = (date: Date) => zonedTimeToUtc(date, 'UTC');
