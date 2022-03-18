import { useQuery } from 'react-query';
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import { startOfISOWeek, endOfISOWeek } from 'date-fns';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button, Group, LoadingOverlay } from '@mantine/core';

import { Content } from './content';
import { Header } from './header';
import { useStore } from '../../store';

export const Calendar = () => {
    const goToNextWeek = useStore((state) => state.nextWeek);
    const copyToNextWeek = useStore((state) => state.copyToNextWeek);
    const goToPreviousWeek = useStore((state) => state.previousWeek);
    const currentWeek = useStore((state) => state.currentWeek);

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

    const onSave = () => {
        // TODO
    };

    const onCancel = () => {
        // TODO
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
                    <Button onClick={goToPreviousWeek}>
                        &#xab; Previous week
                    </Button>
                    <Button onClick={goToNextWeek}>Next week &#xbb;</Button>
                </Group>
                <Group spacing="sm">
                    <Button onClick={copyToNextWeek}>Copy to next week</Button>
                    <Button onClick={onCancel}>Cancel &#x2715;</Button>
                    <Button onClick={onSave}>Save &#x2713;</Button>
                </Group>
            </div>
        </section>
    );
};
