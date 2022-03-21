import { useQuery, useQueryClient } from 'react-query';
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import { startOfISOWeek, endOfISOWeek } from 'date-fns';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button, Group, LoadingOverlay } from '@mantine/core';
import { partition } from 'lodash';

import { Content } from './content';
import { Header } from './header';

import {
    useCurrentWeek,
    useUnsavedChanges,
    useWeeklyScheduleOps,
} from '../../store';

export const Calendar = () => {
    const queryClient = useQueryClient();

    const { currentWeek, nextWeek, previousWeek } = useCurrentWeek();
    const { unsavedChanges, removeChanges } = useUnsavedChanges();
    const { copyToNextWeek } = useWeeklyScheduleOps();

    const { data = [], isFetching } = useQuery(
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

    const onSave = async () => {
        const [editedMeals, newMeals] = partition(
            Object.values(unsavedChanges),
            'id'
        );

        const { error } = await supabaseClient
            .from<EditedMeal>('meals')
            .upsert(editedMeals);

        const { error: e2 } = await supabaseClient
            .from<EditedMeal>('meals')
            .insert(newMeals);

        if (!error && !e2) {
            queryClient.invalidateQueries(['meals', currentWeek]);
            removeChanges();
        }
    };

    const onCancel = () => {
        removeChanges();
    };

    return (
        <section className="calendar-container">
            <LoadingOverlay visible={isFetching} />
            <Header />
            <DndProvider backend={HTML5Backend}>
                <Content meals={data} />
            </DndProvider>
            <div className="controls-wrapper">
                <Group spacing="sm">
                    <Button onClick={previousWeek}>&#xab; Previous week</Button>
                    <Button onClick={nextWeek}>Next week &#xbb;</Button>
                </Group>
                <Group spacing="sm">
                    <Button onClick={() => copyToNextWeek(data)}>
                        Copy to next week
                    </Button>
                    {Object.keys(unsavedChanges).length > 0 && (
                        <>
                            <Button onClick={onCancel}>Cancel &#x2715;</Button>
                            <Button onClick={onSave}>Save &#x2713;</Button>
                        </>
                    )}
                </Group>
            </div>
        </section>
    );
};
