import { Box, Center, List, Stack, Text, Title } from '@mantine/core';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';

import { type Database } from '~types/supabase';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createPagesServerClient<Database>(context);

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (session) {
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

export default function LandingPage() {
    return (
        <Center p={20}>
            <Stack spacing="lg">
                <Box
                    style={{
                        position: 'relative',
                        width: '100%',
                        margin: 'auto',
                        borderRadius: 5,
                        overflow: 'hidden',
                    }}
                >
                    <Image
                        src="/images/landing-page.jpg"
                        alt="An illustration of a woman dancing around fruits and vegetables"
                        priority
                        style={{ width: '100%', height: 'auto' }}
                        width={1152}
                        height={768}
                    />
                </Box>
                <Title order={1}>Your next meal planning solution</Title>
                <Text size="lg">You can use it to:</Text>
                <List size="lg">
                    <List.Item>Plan your weekly meals</List.Item>
                    <List.Item>Record how you follow it</List.Item>
                </List>
            </Stack>
        </Center>
    );
}
