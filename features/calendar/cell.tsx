// import { useDrag, useDrop } from 'react-dnd';
import { useModals } from '@mantine/modals';
import { useUser } from '@supabase/supabase-auth-helpers/react';
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import { useQueryClient } from 'react-query';

import { useCurrentWeek, useUnsavedChanges } from '../../store';
import { ModalContent } from './edit-meal-modal-content';

export const Cell = ({ id, meal, timestamp, isEdited }: CellProps) => {
    const { user } = useUser();
    const queryClient = useQueryClient();

    const { currentWeek } = useCurrentWeek();
    const { addChange, removeChange } = useUnsavedChanges();

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

    const handleDelete = async () => {
        if (!meal) return;

        removeChange(id);

        if (!meal.id) return;

        const { error } = await supabaseClient
            .from('meals')
            .delete()
            .eq('id', meal.id);

        if (!error) {
            queryClient.invalidateQueries(['meals', currentWeek]);
            modals.closeAll();
        }
    };

    return (
        <div
            // ref={drag}
            onClick={() => {
                modals.openModal({
                    title: 'Edit this meal',
                    centered: true,
                    children: (
                        <ModalContent
                            handleSave={handleSave}
                            initialMeal={meal?.meal || ''}
                            deleteMeal={handleDelete}
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
