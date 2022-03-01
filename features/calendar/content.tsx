import { useRef, useState } from 'react';
import { eachDayOfInterval, endOfWeek, format, startOfWeek } from 'date-fns';

import { useOnClickOutside } from '../../hooks/use-on-click-outside';
import { Cell } from './cell';
import { ROWS } from './constants';
import { useStore } from '../../store';

const getDaysOfWeek = (date: Date) => {
    return eachDayOfInterval({
        start: startOfWeek(date, { weekStartsOn: 1 }),
        end: endOfWeek(date, { weekStartsOn: 1 }),
    }).map((day) => ({ timestamp: day, label: format(day, 'EEE dd/M') }));
};

export const Content = ({
    content,
    handleSwap,
    editCell,
}: {
    content: Record<string, Content>;
    handleSwap: HandleSwap;
    editCell: EditCell;
}) => {
    const currentWeek = useStore((state) => state.currentWeek);

    const [editingCell, setEditingCell] = useState<string | null>(null);
    const contentRef = useRef(null);

    useOnClickOutside(contentRef, () => {
        setEditingCell(null);
    });

    return (
        <div className="calendar-content" ref={contentRef}>
            {ROWS.map((row) => {
                return (
                    <div key={row} className="row">
                        <h3>{row}</h3>
                        {getDaysOfWeek(currentWeek).map(({ label }) => (
                            <Cell
                                key={label}
                                value={content[`${row}_${label}`]?.content}
                                id={`${row}_${label}`}
                                handleSwap={handleSwap}
                                editingCell={editingCell}
                                setEditingCell={setEditingCell}
                                editCell={editCell}
                            />
                        ))}
                    </div>
                );
            })}
        </div>
    );
};
