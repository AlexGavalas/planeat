import { eachDayOfInterval, endOfWeek, format, startOfWeek } from 'date-fns';
import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Button } from '../../components/button';
import { ROWS } from './constants';
import { Content } from './content';
import { Header } from './header';
import { useStore } from '../../store';

const getDaysOfWeek = (date: Date) => {
    return eachDayOfInterval({
        start: startOfWeek(date, { weekStartsOn: 1 }),
        end: endOfWeek(date, { weekStartsOn: 1 }),
    }).map((day) => ({ timestamp: day, label: format(day, 'EEE dd/M') }));
};

const getInitialState = (currentWeek: Date) => {
    return Object.fromEntries(
        ROWS.map((row) =>
            getDaysOfWeek(currentWeek).map(({ label }) => [
                `${row}_${label}`,
                { content: '' },
            ])
        ).flat(1)
    );
};

export const Calendar = () => {
    const currentWeek = useStore((state) => state.currentWeek);
    const goToNextWeek = useStore((state) => state.nextWeek);
    const goToPreviousWeek = useStore((state) => state.previousWeek);

    const [content, setContent] = useState<Record<string, Content>>(() => {
        return getInitialState(currentWeek);
    });

    useEffect(() => {
        setContent(getInitialState(currentWeek));
    }, [currentWeek]);

    const handleSwap: HandleSwap = ({ destinationId, originId }) => {
        setContent((prevContent) => {
            [prevContent[destinationId], prevContent[originId]] = [
                prevContent[originId],
                prevContent[destinationId],
            ];

            return { ...prevContent };
        });
    };

    const editCell: EditCell = (key, value) => {
        setContent((prevContent) => {
            prevContent[key].content = value;
            return { ...prevContent };
        });
    };

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
                    handleSwap={handleSwap}
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
