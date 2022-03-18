import { useDrag, useDrop } from 'react-dnd';
import { useModals } from '@mantine/modals';

import { useStore } from '../../store';
import { ModalContent } from './edit-meal-modal-content';
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import { useUser } from '@supabase/supabase-auth-helpers/react';
import { useQueryClient } from 'react-query';

export const Cell = ({ id, meal, timestamp }: CellProps) => {
    const { user } = useUser();
    const queryClient = useQueryClient();

    const swapDays = useStore((state) => state.swapDays);
    const editCell = useStore((state) => state.editCell);
    const currentWeek = useStore((state) => state.currentWeek);

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

    const handleSave = async (meal: string) => {
        if (!user) return;

        editCell(id, meal);

        const { error } = await supabaseClient.from<Meal>('meals').insert({
            meal,
            section_key: id,
            user_id: user.id,
            day: timestamp.toISOString(),
        });

        if (!error) {
            queryClient.invalidateQueries(['meals', currentWeek]);
        }
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
                            initialMeal={meal?.meal || ''}
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
            <p ref={drop}>{meal?.meal}</p>
        </div>
    );
};
