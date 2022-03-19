import { useDrag, useDrop } from 'react-dnd';
import { useModals } from '@mantine/modals';
import { useUser } from '@supabase/supabase-auth-helpers/react';

import { useStore } from '../../store';
import { ModalContent } from './edit-meal-modal-content';

export const Cell = ({ id, meal, timestamp, isEdited }: CellProps) => {
    const { user } = useUser();

    const addChange = useStore((state) => state.addChange);

    const modals = useModals();

    // const [{ isDragging }, drag] = useDrag(() => ({
    //     type: 'cell',
    //     item: meal,
    //     collect: (monitor) => ({
    //         isDragging: !!monitor.isDragging(),
    //     }),
    // }));

    // const [{ isOver }, drop] = useDrop(() => ({
    //     accept: 'cell',
    //     drop: (el: Meal) => {
    //         swapDays({ mealA: meal, mealB: el });
    //     },
    //     collect: (monitor) => ({
    //         isOver: !!monitor.isOver(),
    //     }),
    // }));

    const handleSave = async (value: string) => {
        if (!user) return;

        const editedMeal = {
            ...meal,
            meal: value,
            section_key: id,
            user_id: user.id,
            day: timestamp.toISOString(),
        };

        addChange(editedMeal);
    };

    return (
        <div
            // ref={drag}
            onClick={() => {
                modals.openModal({
                    title: 'Edit this meal',
                    children: (
                        <ModalContent
                            handleSave={handleSave}
                            initialMeal={meal?.meal || ''}
                        />
                    ),
                });
            }}
            style={{
                // ...(isDragging && { opacity: 0.5 }),
                // ...(isOver && { background: '#cbf5d0' }),
                ...(isEdited && { border: '2px solid orange' }),
            }}
            className="cell"
        >
            <p
            //  ref={drop}
            >
                {meal?.meal}
            </p>
        </div>
    );
};
