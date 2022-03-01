import {
    isToday,
    eachDayOfInterval,
    endOfWeek,
    format,
    startOfWeek,
} from 'date-fns';

import { useStore } from '../../store';

const getDaysOfWeek = (date: Date) => {
    return eachDayOfInterval({
        start: startOfWeek(date, { weekStartsOn: 1 }),
        end: endOfWeek(date, { weekStartsOn: 1 }),
    }).map((day) => ({
        timestamp: day,
        isToday: isToday(day),
        label: format(day, 'EEE dd/M'),
    }));
};

export const Header = () => {
    const currentWeek = useStore((state) => state.currentWeek);

    return (
        <div className="calendar-header">
            <div></div>
            {getDaysOfWeek(currentWeek).map(({ label, isToday }) => (
                <h3 key={label} style={{ ...(isToday && { color: 'red' }) }}>
                    {label}
                </h3>
            ))}
        </div>
    );
};
