import { useMemo } from 'react';

import { Cell } from './cell';
import { ROWS } from './constants';
import { useCurrentWeek, useMeals, useUnsavedChanges } from '@store/hooks';
import { getDaysOfWeek } from '@util/date';

import styles from './content.module.css';

export const Content = () => {
    const { currentWeek } = useCurrentWeek();
    const { unsavedChanges } = useUnsavedChanges();
    const { meals } = useMeals();

    const mealsMap = useMemo(
        () =>
            meals.reduce((acc: MealsMap, meal) => {
                acc[meal.section_key] = meal;
                return acc;
            }, {}),
        [meals]
    );

    const daysOfWeek = getDaysOfWeek(currentWeek);

    return (
        <div className={styles.wrapper}>
            {ROWS.map((row) => {
                const isRow =
                    row === 'Morning' || row === 'Snack 1' || row === 'Snack 2';

                if (isRow) {
                    const { label, timestamp } = daysOfWeek[0];

                    return (
                        <div key={row} className={styles.row}>
                            <h3>{row}</h3>
                            <Cell
                                key={label}
                                id={`${row}_${label}`}
                                timestamp={timestamp}
                                meal={
                                    unsavedChanges[`${row}_${label}`] ||
                                    mealsMap[`${row}_${label}`]
                                }
                                isEdited={!!unsavedChanges[`${row}_${label}`]}
                                isRow={true}
                                daysOfWeek={daysOfWeek}
                                row={row}
                                mealsMap={mealsMap}
                            />
                        </div>
                    );
                }

                return (
                    <div key={row} className={styles.row}>
                        <h3>{row}</h3>
                        {daysOfWeek.map(({ label, timestamp }) => (
                            <Cell
                                key={label}
                                id={`${row}_${label}`}
                                timestamp={timestamp}
                                meal={
                                    unsavedChanges[`${row}_${label}`] ||
                                    mealsMap[`${row}_${label}`]
                                }
                                isEdited={!!unsavedChanges[`${row}_${label}`]}
                                isRow={false}
                                row={row}
                            />
                        ))}
                    </div>
                );
            })}
        </div>
    );
};
