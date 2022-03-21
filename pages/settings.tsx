import type { GetServerSideProps } from 'next';
import { FormEventHandler, useState } from 'react';
import { EditPencil, Cancel, Plus, SaveFloppyDisk } from 'iconoir-react';
import { format, parseISO } from 'date-fns';
import { Calendar } from '@mantine/dates';
import { useModals } from '@mantine/modals';
import { useDebouncedValue, useEventListener } from '@mantine/hooks';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useUser } from '@supabase/supabase-auth-helpers/react';
import {
    supabaseClient,
    getUser,
} from '@supabase/supabase-auth-helpers/nextjs';

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
    Box,
    LoadingOverlay,
    Switch,
    Divider,
    Autocomplete,
} from '@mantine/core';

type WeightData = {
    id: string;
    date: string;
    weight: number;
    user_id: string;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { user } = await getUser(context).catch(() => ({ user: null }));

    if (!user) {
        return {
            redirect: {
                destination: '/home',
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
};

const Row = ({ item, page }: { item: WeightData; page: number }) => {
    const [show, setShow] = useState(false);
    const [edit, setEdit] = useState(false);
    const [newWeight, setNewWeight] = useState(item.weight);

    const queryClient = useQueryClient();

    const handleSave = async () => {
        const { error } = await supabaseClient
            .from('weight-measurements')
            .update({
                weight: newWeight,
            })
            .eq('id', item.id);

        if (!error) {
            queryClient.invalidateQueries(['measurements', page]);
            setEdit(false);
        }
    };

    const handleCancel = () => {
        setEdit(false);
    };

    const ref = useEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            handleCancel();
        }
    });

    return (
        <tr
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
            style={{ height: '3rem' }}
            ref={ref}
        >
            <td>{format(parseISO(item.date), 'dd/MM/yy')}</td>
            <td style={{ width: '50%' }}>
                <Group>
                    {edit ? (
                        <NumberInput
                            autoFocus
                            size="xs"
                            defaultValue={item.weight}
                            onChange={(v) => {
                                v && setNewWeight(v);
                            }}
                            precision={2}
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

const NewWeightModalContent = ({
    userId,
    onSave,
}: {
    userId?: string;
    onSave: () => void;
}) => {
    const modals = useModals();

    const [date, setDate] = useState(new Date());
    const [weight, setWeight] = useState<number>();
    const [error, setError] = useState('');

    const handleSave: FormEventHandler = async (e) => {
        e.preventDefault();

        if (!userId) return;

        if (!weight) {
            setError('You forgot to input your weight');
            return;
        }

        const { error } = await supabaseClient
            .from('weight-measurements')
            .insert({
                user_id: userId,
                weight,
                date,
            });

        if (!error) {
            onSave();
            modals.closeAll();
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

const PAGE_SIZE = 2;

const Settings = () => {
    const modals = useModals();
    const { user } = useUser();
    const queryClient = useQueryClient();

    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 250);

    const { data: profile } = useQuery(
        ['user'],
        async () => {
            if (!user) return;

            const { data } = await supabaseClient
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            return data;
        },
        {
            enabled: Boolean(user),
        }
    );

    const { mutate } = useMutation(
        async (value: boolean) => {
            if (!user) return;

            const { data, error } = await supabaseClient
                .from('users')
                .update({ is_nutritionist: value })
                .eq('id', user.id);

            if (error) {
                throw error;
            }

            return data;
        },
        {
            onMutate: () => {
                queryClient.setQueryData(['user'], {
                    ...profile,
                    is_nutritionist: !profile.is_nutritionist,
                });
            },
            onError: () => {
                queryClient.invalidateQueries(['user']);
            },
        }
    );

    const { data: count = 0, isFetched } = useQuery(
        ['measurements-count'],
        async () => {
            const { count } = await supabaseClient
                .from('weight-measurements')
                .select('id', { count: 'exact' });

            return (count || 0) / PAGE_SIZE;
        },
        {
            enabled: Boolean(user),
        }
    );

    const { data: measurements } = useQuery(
        ['measurements', page],
        async () => {
            const { data } = await supabaseClient
                .from('weight-measurements')
                .select('*')
                .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)
                .order('date', { ascending: false });

            return data;
        },
        {
            enabled: Boolean(count),
        }
    );

    const { data, isFetching } = useQuery(
        ['nutritionists', debouncedSearchQuery],
        async () => {
            const { data } = await supabaseClient
                .from('users')
                .select('*')
                .ilike('full_name', `%${debouncedSearchQuery}%`)
                .limit(5);

            return data;
        },
        {
            enabled: Boolean(debouncedSearchQuery),
        }
    );

    const onNewWeightSave = () => {
        setPage(1);
        queryClient.invalidateQueries(['measurements']);
    };

    return (
        <Container>
            <Group position="apart" mt={10}>
                <Switch
                    checked={profile?.is_nutritionist || false}
                    onChange={({ target: { checked } }) => mutate(checked)}
                    label="Είμαι διαιτολόγος"
                />
                <Text>ή</Text>
                <Autocomplete
                    label="Βρες τον διαιτολόγο σου"
                    placeholder="Αναζήτηση"
                    data={(data || []).map(({ full_name }) => full_name)}
                    value={searchQuery}
                    onChange={setSearchQuery}
                    nothingFound={
                        debouncedSearchQuery && !isFetching && !data?.length
                            ? 'Δεν βρέθηκαν αποτελέσματα'
                            : ''
                    }
                />
            </Group>
            <Divider my={20} />
            <Group position="apart" py={20}>
                <Title order={3}>Μετρήσεις βάρους</Title>
                <ActionIcon
                    title="Add a new measurement"
                    variant="light"
                    size="lg"
                    onClick={() => {
                        modals.openModal({
                            title: 'New weight',
                            centered: true,
                            size: 'sm',
                            children: (
                                <NewWeightModalContent
                                    userId={user?.id}
                                    onSave={onNewWeightSave}
                                />
                            ),
                        });
                    }}
                >
                    <Plus />
                </ActionIcon>
            </Group>
            <Box style={{ position: 'relative', minHeight: 200 }}>
                <LoadingOverlay visible={!measurements && !isFetched} />
                {measurements ? (
                    <>
                        <Table highlightOnHover={true}>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th style={{ width: '50%' }}>Weight</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(measurements || []).map((item) => (
                                    <Row
                                        key={item.id}
                                        item={item}
                                        page={page}
                                    />
                                ))}
                            </tbody>
                        </Table>
                        {count > PAGE_SIZE && (
                            <Pagination
                                total={count}
                                position="right"
                                onChange={setPage}
                            />
                        )}
                    </>
                ) : (
                    <Center>
                        <Title order={4}>Δεν έχεις ακόμα καμία μέτρηση</Title>
                    </Center>
                )}
            </Box>
        </Container>
    );
};

export default Settings;
