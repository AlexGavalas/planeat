import { showNotification } from '@mantine/notifications';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import { partition } from 'lodash/fp';
import { useTranslation } from 'next-i18next';
import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { type EditedMeal, type Meal, type MealsMap } from '~types/meal';
import { getDaysOfWeek } from '~util/date';

import { useCurrentWeek } from './current-week';
import { useUnsavedChanges } from './unsaved-changes';

export const useMeals = () => {
    const { t } = useTranslation();
    const { currentWeek } = useCurrentWeek();
    const queryClient = useQueryClient();

    const { unsavedChanges, removeChanges, addChange } = useUnsavedChanges();

    const [submitting, setSubmitting] = useState(false);

    const currentWeekKey = format(currentWeek, 'yyyy-MM-dd');

    const { data: meals = [], isFetching: fetchingMeals } = useQuery(
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

            const { data } = await response.json();

            return (data || []) as Meal[];
        },
        {
            onSettled: () => {
                setSubmitting(false);
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

    const savePlan = async () => {
        setSubmitting(true);

        // The edited meals will have the id from the db
        const [changedMeals, newMeals] = partition(
            'id',
            Object.values(unsavedChanges),
        );

        const [editedMeals, deletedMeals] = partition('meal', changedMeals);

        const deletedIds = deletedMeals.map(({ id }) => id);

        const response = await fetch('/api/v1/meal', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                deletedIds,
                editedMeals,
                newMeals,
            }),
        });

        const { error } = await response.json();

        if (error) {
            setSubmitting(false);

            showNotification({
                title: t('error'),
                message: `${t('errors.meal_save')}. ${t('try_again')}`,
                color: 'red',
            });
        } else {
            await queryClient.invalidateQueries(['meals', currentWeekKey]);

            removeChanges();

            showNotification({
                title: t('notification.success.title'),
                message: t('notification.success.message'),
            });
        }
    };

    const revert = () => {
        removeChanges();
    };

    const deleteEntryCell = async ({ meal }: { meal: Meal | EditedMeal }) => {
        const deletedMeal = {
            ...meal,
            meal: '',
        };

        addChange(deletedMeal);
    };

    const deleteEntryRow = async (id: string) => {
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

    const saveEntryCell = ({
        meal,
        sectionKey,
        timestamp,
        userId,
        value,
        note,
        rating,
    }: {
        meal?: Meal | EditedMeal;
        sectionKey: string;
        timestamp: Date;
        userId: number;
        value: string;
        note: EditedMeal['note'];
        rating: EditedMeal['rating'];
    }) => {
        const day = format(timestamp, 'yyyy-MM-dd HH:mm');

        const editedMeal = {
            ...meal,
            meal: value,
            section_key: sectionKey,
            user_id: userId,
            day,
            note,
            rating,
        };

        addChange(editedMeal);
    };

    const saveEntryRow = ({
        sectionKey,
        userId,
        value,
        note,
        rating,
    }: {
        sectionKey: string;
        userId: number;
        value: string;
        note: EditedMeal['note'];
        rating: EditedMeal['rating'];
    }) => {
        const [row] = sectionKey.split('_');
        const daysOfWeek = getDaysOfWeek(currentWeek);

        for (const { label, timestamp } of daysOfWeek) {
            const key = `${row}_${label}`;

            const meal = mealsMap[key];

            saveEntryCell({
                sectionKey: key,
                timestamp,
                userId,
                value,
                meal,
                note,
                rating,
            });
        }
    };

    return {
        meals,
        loading: fetchingMeals || submitting,
        savePlan,
        revert,
        deleteEntryCell,
        deleteEntryRow,
        saveEntryCell,
        saveEntryRow,
    };
};
