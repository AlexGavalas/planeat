import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { ROWS } from '~constants/calendar';
import { useMealZoneTimes } from '~hooks/use-meal-zone-times';
import { useCurrentWeek, useMeals, useUnsavedChanges } from '~store/hooks';
import { type MealsMap } from '~types/meal';
import { getDaysOfWeek } from '~util/date';

import { Cell } from './cell';
import styles from './content.module.css';

export const Content = () => {
    const { t } = useTranslation();
    const { currentWeek } = useCurrentWeek();
    const { unsavedChanges } = useUnsavedChanges();
    const { meals } = useMeals();
    const { times } = useMealZoneTimes(currentWeek);

    const mealsMap = useMemo(
        () =>
            meals.reduce<MealsMap>((acc, meal) => {
                acc[meal.section_key] = meal;
                return acc;
            }, {}),
        [meals],
    );

    const daysOfWeek = getDaysOfWeek(currentWeek);

    const translatedRows = ROWS.map((row) => ({
        ...row,
        label: t(`row.${row.key}`),
    }));

    return (
        <div className={styles.wrapper}>
            {translatedRows.map((row) => {
                const isRow =
                    row.key === 'morning' ||
                    row.key === 'snack1' ||
                    row.key === 'snack2';

                if (isRow) {
                    if (!daysOfWeek[0]) {
                        return null;
                    }

                    const { label, timestamp } = daysOfWeek[0];

                    return (
                        <div key={row.key} className={styles.row}>
                            <h3>
                                <span>{row.label}</span>
                                <small>{times[row.key]}</small>
                            </h3>
                            <Cell
                                key={label}
                                isRow
                                id={`${row.key}_${label}`}
                                isEdited={
                                    !!unsavedChanges[`${row.key}_${label}`]
                                }
                                meal={
                                    unsavedChanges[`${row.key}_${label}`] ??
                                    mealsMap[`${row.key}_${label}`]
                                }
                                timestamp={timestamp}
                            />
                        </div>
                    );
                }

                return (
                    <div key={row.key} className={styles.row}>
                        <h3>
                            <span>{row.label}</span>
                            <small>{times[row.key]}</small>
                        </h3>
                        {daysOfWeek.map(({ label, timestamp }) => (
                            <Cell
                                key={label}
                                id={`${row.key}_${label}`}
                                isEdited={
                                    !!unsavedChanges[`${row.key}_${label}`]
                                }
                                isRow={false}
                                meal={
                                    unsavedChanges[`${row.key}_${label}`] ??
                                    mealsMap[`${row.key}_${label}`]
                                }
                                timestamp={timestamp}
                            />
                        ))}
                    </div>
                );
            })}
        </div>
    );
};
