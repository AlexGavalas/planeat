import { useRef, useState } from 'react';

import { useOnClickOutside } from '../../hooks/use-on-click-outside';
import { Cell } from './cell';
import { ROWS, DAYS_IN_WEEK } from './constants';

export const Content = ({
    content,
    handleSwap,
    editCell,
}: {
    content: Record<string, Content>;
    handleSwap: HandleSwap;
    editCell: EditCell;
}) => {
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
                        {DAYS_IN_WEEK.map(({ label }) => (
                            <Cell
                                key={label}
                                value={content[`${row}_${label}`].content}
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
