import { eachDayOfInterval, endOfWeek, format, startOfWeek } from 'date-fns';

const NOW = new Date();

export const DAYS_IN_WEEK = eachDayOfInterval({
    start: startOfWeek(NOW, { weekStartsOn: 1 }),
    end: endOfWeek(NOW, { weekStartsOn: 1 }),
}).map((day) => ({ timestamp: day, label: format(day, 'EEE dd/MM/yyyy') }));

export const ROWS = ['Morning', 'Snack 1', 'Lunch', 'Snack 2', 'Dinner'];
