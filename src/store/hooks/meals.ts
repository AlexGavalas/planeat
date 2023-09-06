import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { endOfWeek, startOfWeek } from 'date-fns';
import { partition } from 'lodash/fp';
import { useTranslation } from 'next-i18next';
import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { type EditedMeal, type Meal, type MealsMap } from '~types/meal';
import { type Database } from '~types/supabase';
import { getDaysOfWeek, getUTCDate } from '~util/date';

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
                .gte('day', getUTCDate(startOfWeek(currentWeek)).toUTCString())
                .lte('day', getUTCDate(endOfWeek(currentWeek)).toUTCString());
        },
        {
            select: ({ data }) => data || [],
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
        const [editedMeals, newMeals] = partition(
            'id',
            Object.values(unsavedChanges),
        );

        const updatePromise = supabaseClient.from('meals').upsert(editedMeals);
        const insertPromise = supabaseClient.from('meals').insert(newMeals);

        const [{ error: updateError }, { error: createError }] =
            await Promise.all([updatePromise, insertPromise]);

        if (updateError || createError) {
            setSubmitting(false);

            showNotification({
                title: t('error'),
                message: `${t('errors.meal_save')}. ${t('try_again')}`,
                color: 'red',
            });
        } else {
            await queryClient.invalidateQueries(['meals', currentWeek]);

            showNotification({
                title: t('notification.success.title'),
                message: t('notification.success.message'),
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
        removeChange(id);

        if (!meal.id) {
            return;
        }

        setSubmitting(true);

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
            await queryClient.invalidateQueries(['meals', currentWeek]);

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

        for (const { label } of daysOfWeek) {
            removeChange(`${row}_${label}`);
        }

        if (!meal.id) {
            return;
        }

        setSubmitting(true);

        const sectionKeys = daysOfWeek.map(({ label }) => `${row}_${label}`);

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
            await queryClient.invalidateQueries(['meals', currentWeek]);

            modals.closeAll();
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
