import { showNotification } from '@mantine/notifications';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import { partition } from 'lodash/fp';
import { useTranslation } from 'next-i18next';
import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { fetchMeals } from '~api/meal';
import { type EditedMeal, type Meal, type MealsMap } from '~types/meal';
import { type Database } from '~types/supabase';
import { getDaysOfWeek, getUTCDate } from '~util/date';

import { useCurrentWeek } from './current-week';
import { useUnsavedChanges } from './unsaved-changes';

export const useMeals = () => {
    const { t } = useTranslation();
    const { currentWeek } = useCurrentWeek();
    const queryClient = useQueryClient();
    const supabase = useSupabaseClient<Database>();

    const { unsavedChanges, removeChanges, addChange } = useUnsavedChanges();

    const [submitting, setSubmitting] = useState(false);

    const currentWeekKey = format(getUTCDate(currentWeek), 'yyyy-MM-dd');

    const { data: meals = [], isFetching: fetchingMeals } = useQuery(
        ['meals', currentWeekKey],
        async () => {
            const result = await fetchMeals({
                endDate: getUTCDate(endOfWeek(currentWeek)).toUTCString(),
                startDate: getUTCDate(startOfWeek(currentWeek)).toUTCString(),
                supabase,
            });

            return result.data || [];
        },
        {
            onSuccess: () => {
                removeChanges();
            },
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

        const deletePromise = supabase
            .from('meals')
            .delete()
            .in('id', deletedIds);

        const updatePromise = supabase.from('meals').upsert(editedMeals);
        const insertPromise = supabase.from('meals').insert(newMeals);

        const [
            { error: updateError },
            { error: createError },
            { error: deleteError },
        ] = await Promise.all([updatePromise, insertPromise, deletePromise]);

        if (updateError || createError || deleteError) {
            setSubmitting(false);

            showNotification({
                title: t('error'),
                message: `${t('errors.meal_save')}. ${t('try_again')}`,
                color: 'red',
            });
        } else {
            await queryClient.invalidateQueries(['meals', currentWeekKey]);

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

    const deleteEntryRow = async ({
        id,
        meal,
    }: {
        id: string;
        meal: Meal | EditedMeal;
    }) => {
        const [row] = id.split('_');
        const daysOfWeek = getDaysOfWeek(currentWeek);

        for (const { label } of daysOfWeek) {
            deleteEntryCell({
                meal: { ...meal, section_key: `${row}_${label}` },
            });
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
        const day = getUTCDate(timestamp).toUTCString();

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
