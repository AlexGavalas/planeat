import { Cell } from './cell';
import { ROWS } from './constants';
import { getDaysOfWeek, useStore } from '../../store';

export const Content = () => {
    const currentWeek = useStore((state) => state.currentWeek);

    return (
        <div className="calendar-content">
            {ROWS.map((row) => {
                return (
                    <div key={row} className="row">
                        <h3>{row}</h3>
                        {getDaysOfWeek(currentWeek).map(({ label }) => (
                            <Cell key={label} id={`${row}_${label}`} />
                        ))}
                    </div>
                );
            })}
        </div>
    );
};
