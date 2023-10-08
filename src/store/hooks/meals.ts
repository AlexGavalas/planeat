import { endOfWeek, format, startOfWeek } from 'date-fns';
import { partition } from 'lodash/fp';
import { useTranslation } from 'next-i18next';
import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { type EditedMeal, type Meal, type MealsMap } from '~types/meal';
import { getDaysOfWeek } from '~util/date';
import {
    showErrorNotification,
    showSuccessNotification,
} from '~util/notification';

import { useCurrentWeek } from './current-week';
import { useUnsavedChanges } from './unsaved-changes';

type DeleteEntryCell = (params: { meal: Meal | EditedMeal }) => void;

type DeleteEntryRow = (id: string) => void;

type SaveEntryCell = (params: {
    meal?: Meal | EditedMeal;
    sectionKey: string;
    timestamp: Date;
    userId: number;
    value: string;
    note: EditedMeal['note'];
    rating: EditedMeal['rating'];
}) => void;

type SaveEntryRow = (params: {
    sectionKey: string;
    userId: number;
    value: string;
    note: EditedMeal['note'];
    rating: EditedMeal['rating'];
}) => void;

type UseMeals = () => {
    meals: Meal[];
    isLoading: boolean;
    savePlan: () => Promise<void>;
    revert: () => void;
    deleteEntryCell: DeleteEntryCell;
    deleteEntryRow: DeleteEntryRow;
    saveEntryCell: SaveEntryCell;
    saveEntryRow: SaveEntryRow;
};

export const useMeals: UseMeals = () => {
    const { t } = useTranslation();
    const { currentWeek } = useCurrentWeek();
    const queryClient = useQueryClient();

    const { unsavedChanges, removeChanges, addChange } = useUnsavedChanges();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentWeekKey = format(currentWeek, 'yyyy-MM-dd');

    const { data: meals = [], isFetching: isFetchingMeals } = useQuery(
        ['meals', currentWeekKey],
        async () => {
            const endDate = format(
                endOfWeek(currentWeek, { weekStartsOn: 1 }),
                'yyyy-MM-dd',
            );

            const startDate = format(
                startOfWeek(currentWeek, { weekStartsOn: 1 }),
                'yyyy-MM-dd',
            );

            const response = await fetch(
                `/api/v1/meal?startDate=${startDate}&endDate=${endDate}`,
            );

            const result = (await response.json()) as { data?: Meal[] };

            return result.data ?? [];
        },
        {
            onSettled: () => {
                setIsSubmitting(false);
            },
        },
    );

    const mealsMap = useMemo(
        () =>
            meals.reduce<MealsMap>((acc, meal) => {
                acc[meal.section_key] = meal;
                return acc;
            }, {}),
        [meals],
    );

    const savePlan = async (): Promise<void> => {
        setIsSubmitting(true);

        // The edited meals will have the id from the db
        const [changedMeals, newMeals] = partition(
            'id',
            Object.values(unsavedChanges),
        );

        const [editedMeals, deletedMeals] = partition('meal', changedMeals);

        const deletedIds = deletedMeals.map(({ id }) => id);

        const response = await fetch('/api/v1/meal', {
            body: JSON.stringify({
                deletedIds,
                editedMeals,
                newMeals,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'PATCH',
        });

        if (!response.ok) {
            setIsSubmitting(false);

            showErrorNotification({
                message: `${t('errors.meal_save')}. ${t('try_again')}`,
                title: t('notification.error.title'),
            });
        } else {
            await queryClient.invalidateQueries(['meals', currentWeekKey]);

            removeChanges();

            showSuccessNotification({
                message: t('notification.success.message'),
                title: t('notification.success.title'),
            });
        }
    };

    const revert = (): void => {
        removeChanges();
    };

    const deleteEntryCell: DeleteEntryCell = ({ meal }) => {
        const deletedMeal = {
            ...meal,
            meal: '',
        };

        addChange(deletedMeal);
    };

    const deleteEntryRow: DeleteEntryRow = (id) => {
        const [row] = id.split('_');
        const daysOfWeek = getDaysOfWeek(currentWeek);

        for (const { label } of daysOfWeek) {
            const sectionKey = `${row}_${label}`;
            const meal = meals.find((m) => m.section_key === sectionKey);

            if (!meal) {
                console.warn('No meal found for row', row);
                continue;
            }

            deleteEntryCell({ meal });
        }
    };

    const saveEntryCell: SaveEntryCell = ({
        meal,
        sectionKey,
        timestamp,
        userId,
        value,
        note,
        rating,
    }) => {
        const day = format(timestamp, 'yyyy-MM-dd HH:mm');

        const editedMeal = {
            ...meal,
            day,
            meal: value,
            note,
            rating,
            section_key: sectionKey,
            user_id: userId,
        };

        addChange(editedMeal);
    };

    const saveEntryRow: SaveEntryRow = ({
        sectionKey,
        userId,
        value,
        note,
        rating,
    }) => {
        const [row] = sectionKey.split('_');
        const daysOfWeek = getDaysOfWeek(currentWeek);

        for (const { label, timestamp } of daysOfWeek) {
            const key = `${row}_${label}`;

            const meal = mealsMap[key];

            saveEntryCell({
                meal,
                note,
                rating,
                sectionKey: key,
                timestamp,
                userId,
                value,
            });
        }
    };

    return {
        deleteEntryCell,
        deleteEntryRow,
        isLoading: isFetchingMeals || isSubmitting,
        meals,
        revert,
        saveEntryCell,
        saveEntryRow,
        savePlan,
    };
};
