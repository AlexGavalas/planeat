import { isToday } from 'date-fns';

import { useCurrentWeek } from '@store/hooks';
import { getDaysOfWeek } from '@util/date';

import styles from './header.module.css';

export const Header = () => {
    const { currentWeek } = useCurrentWeek();

    return (
        <div className={styles.wrapper}>
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
