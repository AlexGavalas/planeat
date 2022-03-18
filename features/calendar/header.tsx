import { isToday } from 'date-fns';

import { useStore } from '../../store';
import { getDaysOfWeek } from '@util/date';

export const Header = () => {
    const currentWeek = useStore((state) => state.currentWeek);

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
