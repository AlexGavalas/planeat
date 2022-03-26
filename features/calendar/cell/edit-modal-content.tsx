import { FormEventHandler, useState } from 'react';
import { Group, Textarea, Button } from '@mantine/core';
import { useModals } from '@mantine/modals';

interface ModalContentProps {
    deleteMeal: () => Promise<void>;
    handleSave: (meal: string) => Promise<void>;
    initialMeal: string;
}

export const ModalContent = ({
    handleSave,
    initialMeal,
    deleteMeal,
}: ModalContentProps) => {
    const modals = useModals();
    const [error, setError] = useState('');

    const closeModal = () => modals.closeAll();

    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        const meal = new FormData(e.currentTarget).get('meal')?.toString();

        if (!meal) {
            return setError('You have not entered a meal to save');
        }

        handleSave(meal);
        closeModal();
    };

    const onDelete = () => {
        deleteMeal();
        closeModal();
    };

    return (
        <form onSubmit={onSubmit}>
            <Group direction="column" spacing="sm" grow>
                <Textarea
                    data-autofocus
                    name="meal"
                    placeholder="Enter here"
                    label="Your meal"
                    defaultValue={initialMeal}
                    autosize
                    minRows={5}
                    maxRows={20}
                    error={error}
                    onFocus={() => {
                        setError('');
                    }}
                />
                <Group position="apart" spacing="sm">
                    <Button variant="light" color="red" onClick={closeModal}>
                        Cancel
                    </Button>
                    <Group>
                        <Button
                            color="red"
                            hidden={!initialMeal}
                            onClick={onDelete}
                        >
                            Delete
                        </Button>
                        <Button type="submit">Save</Button>
                    </Group>
                </Group>
            </Group>
        </form>
    );
};
