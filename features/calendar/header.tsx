import { DAYS_IN_WEEK } from './constants';

export const Header = () => {
    return (
        <div className="calendar-header">
            <div></div>
            {DAYS_IN_WEEK.map(({ label }) => (
                <h3 key={label}>{label}</h3>
            ))}
        </div>
    );
};
