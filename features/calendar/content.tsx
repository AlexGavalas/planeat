import { useMemo } from 'react';

import { Cell } from './cell';
import { ROWS } from './constants';
import { useStore } from '../../store';
import { getDaysOfWeek } from '@util/date';

export const Content = ({ meals }: { meals: Meal[] }) => {
    const currentWeek = useStore((state) => state.currentWeek);

    const mealsMap = useMemo(
        () =>
            meals.reduce((acc: MealsMap, meal) => {
                acc[meal.section_key] = meal;
                return acc;
            }, {}),
        [meals]
    );

    return (
        <div className="calendar-content">
            {ROWS.map((row) => {
                return (
                    <div key={row} className="row">
                        <h3>{row}</h3>
                        {getDaysOfWeek(currentWeek).map(
                            ({ label, timestamp }) => (
                                <Cell
                                    key={label}
                                    id={`${row}_${label}`}
                                    timestamp={timestamp}
                                    meal={mealsMap[`${row}_${label}`]}
                                />
                            )
                        )}
                    </div>
                );
            })}
        </div>
    );
};
