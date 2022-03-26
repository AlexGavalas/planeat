import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button, Group, LoadingOverlay } from '@mantine/core';

import { Content } from './content';
import { Header } from './header';

import {
    useCurrentWeek,
    useUnsavedChanges,
    useWeeklyScheduleOps,
    useMeals,
} from '../../store';

export const Calendar = () => {
    const { nextWeek, previousWeek } = useCurrentWeek();
    const { unsavedChanges } = useUnsavedChanges();
    const { copyToNextWeek } = useWeeklyScheduleOps();
    const { fetchingMeals, meals, revert, savePlan } = useMeals();

    return (
        <section className="calendar-container">
            <LoadingOverlay visible={fetchingMeals} />
            <Header />
            <DndProvider backend={HTML5Backend}>
                <Content />
            </DndProvider>
            <div className="controls-wrapper">
                <Group spacing="sm">
                    <Button onClick={previousWeek}>&#xab; Previous week</Button>
                    <Button onClick={nextWeek}>Next week &#xbb;</Button>
                </Group>
                <Group spacing="sm">
                    <Button onClick={() => copyToNextWeek(meals)}>
                        Copy to next week
                    </Button>
                    {Object.keys(unsavedChanges).length > 0 && (
                        <>
                            <Button onClick={revert}>Cancel &#x2715;</Button>
                            <Button onClick={savePlan}>Save &#x2713;</Button>
                        </>
                    )}
                </Group>
            </div>
        </section>
    );
};
