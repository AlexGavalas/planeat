import { useState } from 'react';
import { Group, Textarea, Button } from '@mantine/core';
import { useModals } from '@mantine/modals';

export const ModalContent = ({
    handleSave,
    initialMeal,
}: {
    handleSave: (meal: string) => void;
    initialMeal: string;
}) => {
    const modals = useModals();
    const [error, setError] = useState('');

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();

                const meal = new FormData(e.currentTarget)
                    .get('meal')
                    ?.toString();

                if (!meal) {
                    return setError('You have not entered a meal to save');
                }

                handleSave(meal);
                modals.closeAll();
            }}
        >
            <Group direction="column" spacing="sm" grow>
                <Textarea
                    name="meal"
                    placeholder="Enter here"
                    label="Your meal"
                    defaultValue={initialMeal}
                    autosize
                    minRows={3}
                    maxRows={20}
                    error={error}
                    onFocus={() => {
                        setError('');
                    }}
                />
                <Group position="apart" spacing="sm">
                    <Button
                        variant="light"
                        color="red"
                        onClick={() => {
                            modals.closeAll();
                        }}
                    >
                        Cancel
                    </Button>
                    <Button type="submit">Save</Button>
                </Group>
            </Group>
        </form>
    );
};
