import { Dispatch, SetStateAction, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { getClassnames } from '../../util/classnames';
import { Button } from '../../components/button';
import { useStore } from '../../store';

interface CellProps {
    id: string;
    editingCell: string | null;
    setEditingCell: Dispatch<SetStateAction<string | null>>;
}

export const Cell = ({ id, editingCell, setEditingCell }: CellProps) => {
    const swapDays = useStore((state) => state.swapDays);
    const editCell = useStore((state) => state.editCell);

    const value = useStore(
        (state) => state.content[state.currentWeek.toISOString()][id].content
    );

    const [content, setContent] = useState(value);

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'cell',
        item: { id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'cell',
        drop: (el: { id: string }) => {
            swapDays({ destinationId: id, originId: el.id });
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    const isEdit = editingCell === id;

    return (
        <div
            ref={drag}
            onClick={() => {
                setEditingCell(id);
            }}
            style={{
                ...(isDragging && { opacity: 0.5 }),
                ...(isOver && { background: '#cbf5d0' }),
            }}
            className={getClassnames({ editing: isEdit }, 'cell')}
        >
            {isEdit ? (
                <textarea
                    className="edit"
                    autoFocus={true}
                    value={content}
                    onChange={(e) => {
                        setContent(e.target.value);
                    }}
                />
            ) : (
                <p ref={drop}>{value}</p>
            )}
            {isEdit && (
                <div className="buttons">
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            setEditingCell(null);
                            setContent(value);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            setEditingCell(null);
                            editCell(id, content);
                        }}
                    >
                        Save
                    </Button>
                </div>
            )}
        </div>
    );
};
