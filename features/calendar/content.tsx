import { useRef, useState } from 'react';

import { useOnClickOutside } from '../../hooks/use-on-click-outside';
import { Cell } from './cell';
import { ROWS } from './constants';
import { getDaysOfWeek, useStore } from '../../store';

export const Content = () => {
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
                                id={`${row}_${label}`}
                                editingCell={editingCell}
                                setEditingCell={setEditingCell}
                            />
                        ))}
                    </div>
                );
            })}
        </div>
    );
};
