import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';

import { useCurrentWeek, useMeals, useUnsavedChanges } from '~store/hooks';
import { type MealsMap } from '~types/meal';
import { getDaysOfWeek } from '~util/date';

import { Cell } from './cell';
import { ROWS } from './constants';
import styles from './content.module.css';

export const Content = () => {
    const { t } = useTranslation();
    const { currentWeek } = useCurrentWeek();
    const { unsavedChanges } = useUnsavedChanges();
    const { meals } = useMeals();

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
                    const { label, timestamp } = daysOfWeek[0];

                    return (
                        <div key={row.key} className={styles.row}>
                            <h3>{row.label}</h3>
                            <Cell
                                key={label}
                                id={`${row.key}_${label}`}
                                timestamp={timestamp}
                                meal={
                                    unsavedChanges[`${row.key}_${label}`] ||
                                    mealsMap[`${row.key}_${label}`]
                                }
                                isEdited={
                                    !!unsavedChanges[`${row.key}_${label}`]
                                }
                                isRow
                            />
                        </div>
                    );
                }

                return (
                    <div key={row.key} className={styles.row}>
                        <h3>{row.label}</h3>
                        {daysOfWeek.map(({ label, timestamp }) => (
                            <Cell
                                key={label}
                                id={`${row.key}_${label}`}
                                timestamp={timestamp}
                                meal={
                                    unsavedChanges[`${row.key}_${label}`] ||
                                    mealsMap[`${row.key}_${label}`]
                                }
                                isEdited={
                                    !!unsavedChanges[`${row.key}_${label}`]
                                }
                                isRow={false}
                            />
                        ))}
                    </div>
                );
            })}
        </div>
    );
};
