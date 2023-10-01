import { eachDayOfInterval, endOfWeek, format, startOfWeek } from 'date-fns';
import el from 'date-fns/locale/el';
import enGB from 'date-fns/locale/en-GB';

const localeMap = {
    en: enGB,
    gr: el,
};

export const getDaysOfWeek = (
    date: Date,
    formatString = 'EEE dd/MM/yyyy',
    locale: keyof typeof localeMap = 'en',
): { timestamp: Date; label: string }[] => {
    return eachDayOfInterval({
        end: endOfWeek(date, { weekStartsOn: 1 }),
        start: startOfWeek(date, { weekStartsOn: 1 }),
    }).map((day) => ({
        label: format(day, formatString, {
            locale: localeMap[locale],
        }),
        timestamp: day,
    }));
};
