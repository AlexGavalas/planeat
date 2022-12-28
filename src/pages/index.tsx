import { Box, Center, List, Stack, Text, Title } from '@mantine/core';
import { getUser } from '@supabase/auth-helpers-nextjs';
import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';

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
            <Stack spacing="lg">
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
            </Stack>
        </Center>
    );
};

export default Home;
