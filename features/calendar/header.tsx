import { isToday } from 'date-fns';

import { useCurrentWeek } from '../../store';
import { getDaysOfWeek } from '@util/date';

export const Header = () => {
    const { currentWeek } = useCurrentWeek();

    return (
        <div className="calendar-header">
            <div></div>
            {getDaysOfWeek(currentWeek, 'EEE dd/MM').map(
                ({ timestamp, label }) => (
                    <h3
                        key={label}
                        style={{ ...(isToday(timestamp) && { color: 'red' }) }}
                    >
                        {label}
                    </h3>
                )
            )}
        </div>
    );
};
