import { useNotifications } from '@mantine/notifications';
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import { startOfISOWeek, endOfISOWeek } from 'date-fns';
import { partition } from 'lodash/fp';
import { useQueryClient, useQuery } from 'react-query';

import { useCurrentWeek } from './current-week';
import { useUnsavedChanges } from './unsaved-changes';

export const useMeals = () => {
    const { currentWeek } = useCurrentWeek();
    const { unsavedChanges, removeChanges } = useUnsavedChanges();
    const queryClient = useQueryClient();
    const notifications = useNotifications();

    const { data: meals = [], isFetching: fetchingMeals } = useQuery(
        ['meals', currentWeek],
        async () => {
            return supabaseClient
                .from<Meal>('meals')
                .select('*')
                .gte('day', startOfISOWeek(currentWeek).toISOString())
                .lte('day', endOfISOWeek(currentWeek).toISOString());
        },
        {
            select: ({ data }) => data || [],
        }
    );

    const savePlan = async () => {
        // The edited meals will have the id from the db
        const [editedMeals, newMeals] = partition(
            'id',
            Object.values(unsavedChanges)
        );

        const { error: updateError } = await supabaseClient
            .from<EditedMeal>('meals')
            .upsert(editedMeals);

        const { error: createError } = await supabaseClient
            .from<EditedMeal>('meals')
            .insert(newMeals);

        // TODO: Handle errors
        if (!updateError && !createError) {
            queryClient.invalidateQueries(['meals', currentWeek]);
            removeChanges();

            notifications.showNotification({
                title: 'Success',
                message: 'Your changes have been saved',
                color: 'green',
            });
        }
    };

    const revert = () => {
        removeChanges();
    };

    return {
        meals,
        fetchingMeals,
        savePlan,
        revert,
    };
};
