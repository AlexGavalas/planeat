import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '../../components/button';

import { DAYS_IN_WEEK, ROWS } from './constants';
import { Content } from './content';
import { Header } from './header';

export const Calendar = () => {
    const [content, setContent] = useState<Record<string, Content>>(() => {
        return Object.fromEntries(
            ROWS.map((row) =>
                DAYS_IN_WEEK.map(({ label }) => [
                    `${row}_${label}`,
                    { content: '' },
                ])
            ).flat(1)
        );
    });

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
            <div className="calendar-control-buttons">
                <Button onClick={onCancel}>Cancel</Button>
                <Button onClick={onSave}>Save</Button>
            </div>
        </section>
    );
};
