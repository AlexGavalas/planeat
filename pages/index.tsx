import type { GetServerSideProps } from 'next';
import { getUser } from '@supabase/supabase-auth-helpers/nextjs';
import { Center, Title, Text, List, Group } from '@mantine/core';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { user } = await getUser(context);

    if (user) {
        return {
            props: {
                user,
            },
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

export default function Home() {
    return (
        <div className="home-container">
            <Center>
                <Group direction="column" spacing="lg">
                    <Title order={1}>Your next meal planning solution</Title>
                    <Text size="lg">You can use it to:</Text>
                    <List size="lg">
                        <List.Item>Plan your weekly meals</List.Item>
                        <List.Item>Collaborate with your nutrionist</List.Item>
                    </List>
                </Group>
            </Center>
        </div>
    );
}
