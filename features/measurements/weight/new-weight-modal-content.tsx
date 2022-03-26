import { Group, Center, Space, Text, NumberInput, Button } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import { useModals } from '@mantine/modals';
import { useNotifications } from '@mantine/notifications';
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import { useState, FormEventHandler } from 'react';

interface ModalContentProps {
    userId: string;
    onSave: () => void;
}

export const NewWeightModalContent = ({
    userId,
    onSave,
}: ModalContentProps) => {
    const modals = useModals();
    const notifications = useNotifications();

    const [date, setDate] = useState(new Date());
    const [weight, setWeight] = useState<number>();
    const [error, setError] = useState('');

    const closeModal = () => modals.closeAll();

    const handleSave: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        if (!weight) {
            return setError('You forgot to input your weight');
        }

        const { error } = await supabaseClient
            .from('weight-measurements')
            .insert({
                user_id: userId,
                weight,
                date,
            });

        if (error) {
            notifications.showNotification({
                title: 'Error',
                message: 'We could not save your weight. Please try again.',
                color: 'red',
                autoClose: 5000,
            });
        } else {
            onSave();
            closeModal();
        }
    };

    return (
        <form onSubmit={handleSave}>
            <Text>Date measured</Text>
            <Center>
                <Calendar value={date} onChange={setDate} />
            </Center>
            <Space h={20} />
            <NumberInput
                label="New weight"
                error={error}
                onFocus={() => setError('')}
                onChange={setWeight}
            />
            <Space h={20} />
            <Group position="apart">
                <Button variant="light" color="red" onClick={closeModal}>
                    Cancel
                </Button>
                <Button type="submit">Save</Button>
            </Group>
        </form>
    );
};
