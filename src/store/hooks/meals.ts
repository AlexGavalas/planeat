import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { endOfISOWeek, startOfISOWeek } from 'date-fns';
import { partition } from 'lodash/fp';
import { useTranslation } from 'next-i18next';
import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { type Database } from '~types/supabase';
import { getDaysOfWeek } from '~util/date';

import { useCurrentWeek } from './current-week';
import { useUnsavedChanges } from './unsaved-changes';

export const useMeals = () => {
    const { t } = useTranslation();

    const { currentWeek } = useCurrentWeek();
    const queryClient = useQueryClient();
    const supabaseClient = useSupabaseClient<Database>();
    const modals = useModals();

    const { unsavedChanges, removeChanges, removeChange, addChange } =
        useUnsavedChanges();

    const [submitting, setSubmitting] = useState(false);

    const { data: meals = [], isFetching: fetchingMeals } = useQuery(
        ['meals', currentWeek],
        async () => {
            return supabaseClient
                .from('meals')
                .select('*')
                .gte('day', startOfISOWeek(currentWeek).toISOString())
                .lte('day', endOfISOWeek(currentWeek).toISOString());
        },
        {
            select: ({ data }) => data || [],
            onSettled: () => {
                setSubmitting(false);
            },
        },
    );

    const mealsMap = useMemo(
        () =>
            meals.reduce((acc: MealsMap, meal) => {
                acc[meal.section_key] = meal;
                return acc;
            }, {}),
        [meals],
    );

    const savePlan = async () => {
        setSubmitting(true);

        // The edited meals will have the id from the db
        const [editedMeals, newMeals] = partition(
            'id',
            Object.values(unsavedChanges),
        );

        const { error: updateError } = await supabaseClient
            .from('meals')
            .upsert(editedMeals);

        const { error: createError } = await supabaseClient
            .from('meals')
            .insert(newMeals);

        if (updateError || createError) {
            setSubmitting(false);

            showNotification({
                title: t('error'),
                message: `${t('errors.meal_save')}. ${t('try_again')}`,
                color: 'red',
            });
        } else {
            queryClient.invalidateQueries(['meals', currentWeek]);

            removeChanges();

            showNotification({
                title: t('success'),
                message: t('meal_save_success'),
                color: 'green',
            });
        }
    };

    const revert = () => {
        removeChanges();
    };

    const deleteEntryCell = async ({
        id,
        meal,
    }: {
        id: string;
        meal: Meal | EditedMeal;
    }) => {
        // Remove local change
        removeChange(id);

        if (!meal.id) return;

        setSubmitting(true);

        // Remove db entry
        const { error } = await supabaseClient
            .from('meals')
            .delete()
            .eq('id', meal.id);

        if (error) {
            setSubmitting(false);

            showNotification({
                title: t('error'),
                message: `${t('errors.meal_delete')}. ${t('try_again')}`,
                color: 'red',
            });
        } else {
            queryClient.invalidateQueries(['meals', currentWeek]);

            modals.closeAll();
        }
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

        // Remove local changes
        for (const { label } of daysOfWeek) {
            removeChange(`${row}_${label}`);
        }

        if (!meal.id) return;

        setSubmitting(true);

        const sectionKeys = daysOfWeek.map(({ label }) => `${row}_${label}`);

        // Remove db entries
        const { error } = await supabaseClient
            .from('meals')
            .delete()
            .in('section_key', sectionKeys);

        if (error) {
            setSubmitting(false);

            showNotification({
                title: t('error'),
                message: `${t('errors.meal_delete')}. ${t('try_again')}`,
                color: 'red',
            });
        } else {
            queryClient.invalidateQueries(['meals', currentWeek]);

            modals.closeAll();
        }
    };

    const saveEntryCell = ({
        meal,
        sectionKey,
        timestamp,
        userId,
        value,
    }: {
        meal?: Meal | EditedMeal;
        sectionKey: string;
        timestamp: Date;
        userId: string;
        value: string;
    }) => {
        const editedMeal = {
            ...meal,
            meal: value,
            section_key: sectionKey,
            user_id: userId,
            day: timestamp.toISOString(),
        };

        addChange(editedMeal);
    };

    const saveEntryRow = ({
        sectionKey,
        userId,
        value,
    }: {
        sectionKey: string;
        userId: string;
        value: string;
    }) => {
        const [row] = sectionKey.split('_');
        const daysOfWeek = getDaysOfWeek(currentWeek);

        for (const { label, timestamp } of daysOfWeek) {
            const key = `${row}_${label}`;

            const meal = mealsMap[key];

            saveEntryCell({ sectionKey: key, timestamp, userId, value, meal });
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
