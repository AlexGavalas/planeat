import { eachDayOfInterval, endOfWeek, format, startOfWeek } from 'date-fns';

export const getDaysOfWeek = (
    date: Date,
    formatString: string = 'EEE dd/MM/yyyy'
) => {
    return eachDayOfInterval({
        start: startOfWeek(date, { weekStartsOn: 1 }),
        end: endOfWeek(date, { weekStartsOn: 1 }),
    }).map((day) => ({ timestamp: day, label: format(day, formatString) }));
};
