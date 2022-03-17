import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Button } from '../../components/button';
import { Content } from './content';
import { Header } from './header';
import { useStore } from '../../store';

export const Calendar = () => {
    const goToNextWeek = useStore((state) => state.nextWeek);
    const copyToNextWeek = useStore((state) => state.copyToNextWeek);
    const goToPreviousWeek = useStore((state) => state.previousWeek);

    const onSave = () => {
        // TODO
    };

    const onCancel = () => {
        // TODO
    };

    return (
        <section className="calendar-container">
            <Header />
            <DndProvider backend={HTML5Backend}>
                <Content />
            </DndProvider>
            <div className="controls-wrapper">
                <div className="calendar-week-controls">
                    <Button onClick={goToPreviousWeek}>
                        &#xab; Previous week
                    </Button>
                    <Button onClick={goToNextWeek}>Next week &#xbb;</Button>
                </div>
                <div className="calendar-control-buttons">
                    <Button onClick={copyToNextWeek}>Copy to next week</Button>
                    <Button onClick={onCancel}>Cancel &#x2715;</Button>
                    <Button onClick={onSave}>Save &#x2713;</Button>
                </div>
            </div>
        </section>
    );
};
