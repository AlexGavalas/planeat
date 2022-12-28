import { eachDayOfInterval, endOfWeek, format, startOfWeek } from 'date-fns';
import el from 'date-fns/locale/el';

const localeMap = {
    gr: el,
};

export const getDaysOfWeek = (
    date: Date,
    formatString = 'EEE dd/MM/yyyy',
    locale = '',
) => {
    return eachDayOfInterval({
        start: startOfWeek(date, { weekStartsOn: 1 }),
        end: endOfWeek(date, { weekStartsOn: 1 }),
    }).map((day) => ({
        timestamp: day,
        label: format(day, formatString, {
            locale: localeMap[locale as keyof typeof localeMap],
        }),
    }));
};
