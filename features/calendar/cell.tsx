import { useDrag, useDrop } from 'react-dnd';
import { useModals } from '@mantine/modals';

import { useStore } from '../../store';
import { ModalContent } from './edit-meal-modal-content';

interface CellProps {
    id: string;
}

export const Cell = ({ id }: CellProps) => {
    const swapDays = useStore((state) => state.swapDays);
    const editCell = useStore((state) => state.editCell);

    const value = useStore(
        (state) => state.content[state.currentWeek.toISOString()][id].content
    );

    const modals = useModals();

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

    const handleSave = (meal: string) => {
        editCell(id, meal);
    };

    return (
        <div
            ref={drag}
            onClick={() => {
                modals.openModal({
                    title: 'Edit this meal',
                    children: (
                        <ModalContent
                            handleSave={handleSave}
                            initialMeal={value}
                        />
                    ),
                });
            }}
            style={{
                ...(isDragging && { opacity: 0.5 }),
                ...(isOver && { background: '#cbf5d0' }),
            }}
            className="cell"
        >
            <p ref={drop}>{value}</p>
        </div>
    );
};
