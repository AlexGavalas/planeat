import { FormEventHandler, useState } from 'react';
import { EditPencil, Cancel, Plus, SaveFloppyDisk } from 'iconoir-react';
import { format, parseISO } from 'date-fns';
import { Calendar } from '@mantine/dates';
import { useModals } from '@mantine/modals';

import {
    ActionIcon,
    Container,
    Group,
    NumberInput,
    Pagination,
    Table,
    Title,
    Text,
    Space,
    Button,
    Center,
} from '@mantine/core';

type WeightData = {
    id: string;
    date: string;
    weight: number;
    user_id: string;
};

const data: WeightData[] = [
    { date: new Date().toISOString(), id: '1', user_id: '1', weight: 88 },
    { date: new Date().toISOString(), id: '2', user_id: '1', weight: 88 },
    { date: new Date().toISOString(), id: '3', user_id: '1', weight: 88 },
];

const Row = ({ item }: { item: WeightData }) => {
    const [show, setShow] = useState(false);
    const [edit, setEdit] = useState(false);
    const [newWeight, setNewWeight] = useState(item.weight);

    const handleSave = () => {
        setEdit(false);
    };

    const handleCancel = () => {
        setEdit(false);
    };

    return (
        <tr
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
            style={{ height: '3rem' }}
        >
            <td>{format(parseISO(item.date), 'dd/MM/yy')}</td>
            <td style={{ width: '50%' }}>
                <Group>
                    {edit ? (
                        <NumberInput
                            size="xs"
                            defaultValue={item.weight}
                            onChange={(v) => {
                                v && setNewWeight(v);
                            }}
                        />
                    ) : (
                        item.weight
                    )}
                    {show && !edit && (
                        <ActionIcon
                            size="sm"
                            onClick={() => setEdit(true)}
                            title="Edit"
                        >
                            <EditPencil />
                        </ActionIcon>
                    )}
                    {edit && (
                        <Group>
                            <ActionIcon
                                size="sm"
                                onClick={handleSave}
                                title="Save"
                            >
                                <SaveFloppyDisk />
                            </ActionIcon>
                            <ActionIcon
                                size="sm"
                                onClick={handleCancel}
                                title="Cancel"
                            >
                                <Cancel />
                            </ActionIcon>
                        </Group>
                    )}
                </Group>
            </td>
        </tr>
    );
};

const NewWeightModalContent = () => {
    const modals = useModals();

    const [value, setValue] = useState(new Date());
    const [weight, setWeight] = useState<number>();
    const [error, setError] = useState('');

    const handleSave: FormEventHandler = (e) => {
        e.preventDefault();

        if (!weight) {
            setError('You forgot to input your weight');
            return;
        }

        modals.closeAll();
    };

    return (
        <form onSubmit={handleSave}>
            <Text>Date measured</Text>
            <Center>
                <Calendar value={value} onChange={setValue} />
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
                <Button
                    variant="light"
                    color="red"
                    onClick={() => {
                        modals.closeAll();
                    }}
                >
                    Cancel
                </Button>
                <Button onClick={handleSave}>Save</Button>
            </Group>
        </form>
    );
};

const Settings = () => {
    const modals = useModals();

    return (
        <Container>
            <Group position="apart" py={20}>
                <Title order={3}>Your weight measurements</Title>
                <ActionIcon
                    title="Add a new measurement"
                    variant="light"
                    size="lg"
                    onClick={() => {
                        modals.openModal({
                            title: 'New weight',
                            centered: true,
                            size: 'sm',
                            children: <NewWeightModalContent />,
                        });
                    }}
                >
                    <Plus />
                </ActionIcon>
            </Group>
            <Table highlightOnHover={true}>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Weight</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <Row key={item.id} item={item} />
                    ))}
                </tbody>
            </Table>
            <Pagination total={10} position="right" />
        </Container>
    );
};

export default Settings;
