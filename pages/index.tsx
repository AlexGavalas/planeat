import type { GetServerSideProps } from 'next';
import Image from 'next/image';
import { getUser } from '@supabase/supabase-auth-helpers/nextjs';
import { Center, Title, Text, List, Group, Box } from '@mantine/core';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { user } = await getUser(context);

    if (user) {
        return {
            redirect: {
                destination: '/home',
                permanent: false,
            },
        };
    }

    return {
        props: {
            ...(await serverSideTranslations('en', ['common'])),
        },
    };
};

const Home = () => {
    return (
        <Center pt={20}>
            <Group direction="column" spacing="lg">
                <Box
                    style={{
                        position: 'relative',
                        margin: 'auto',
                        width: 500,
                        height: 500,
                        borderRadius: 5,
                        overflow: 'hidden',
                    }}
                >
                    <Image
                        src="/images/kitchen.png"
                        layout="fill"
                        alt="An illustration of a kitchen"
                        priority={true}
                    />
                </Box>
                <Title order={1}>Your next meal planning solution</Title>
                <Text size="lg">You can use it to:</Text>
                <List size="lg">
                    <List.Item>Plan your weekly meals</List.Item>
                    <List.Item>Collaborate with your nutrionist</List.Item>
                </List>
            </Group>
        </Center>
    );
};

export default Home;
