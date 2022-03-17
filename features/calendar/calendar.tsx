import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Button } from '../../components/button';
import { Content } from './content';
import { Header } from './header';
import { useStore } from '../../store';

export const Calendar = () => {
    const currentWeek = useStore((state) => state.currentWeek);
    const goToNextWeek = useStore((state) => state.nextWeek);
    const swapDays = useStore((state) => state.swapDays);
    const editCell = useStore((state) => state.editCell);
    const goToPreviousWeek = useStore((state) => state.previousWeek);

    const content = useStore(
        (state) => state.content[currentWeek.toISOString()]
    );

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
                <Content
                    content={content}
                    handleSwap={swapDays}
                    editCell={editCell}
                />
            </DndProvider>
            <div className="controls-wrapper">
                <div className="calendar-week-controls">
                    <Button onClick={goToPreviousWeek}>
                        &#xab; Previous week
                    </Button>
                    <Button onClick={goToNextWeek}>Next week &#xbb;</Button>
                </div>
                <div className="calendar-control-buttons">
                    <Button onClick={onCancel}>Cancel &#x2715;</Button>
                    <Button onClick={onSave}>Save &#x2713;</Button>
                </div>
            </div>
        </section>
    );
};
