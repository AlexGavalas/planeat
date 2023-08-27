import { Center, List, Stack, Text, Title } from '@mantine/core';
import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { getServerSession } from '~api/session';
import { Blobs, Line } from '~components/icons/line';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context);

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
    const appName = (
        <Text fw={700} span>
            Planeat
        </Text>
    );

    return (
        <Center>
            <Stack spacing="xl" className="content">
                <Blobs />
                <Title order={1}>Welcome to Planeat!</Title>
                <Title order={2}>
                    Your Ultimate Health and Wellness Companion
                </Title>
                <Text size="lg">
                    Achieving a balanced and healthy lifestyle has never been
                    easier. Whether you are looking to revamp your eating
                    habits, stay on top of your fitness journey, or simply
                    prioritize your well-being, {appName} is here to guide you
                    every step of the way.
                </Text>
                <List size="lg" spacing="lg">
                    <List.Item icon="🥗">
                        Create and Track Your Meal Plan: With {appName}, you can
                        effortlessly design a personalized weekly meal plan that
                        aligns with your nutritional goals. From breakfast to
                        dinner, our intuitive platform helps you curate
                        delicious and wholesome meals.
                    </List.Item>
                    <List.Item icon="🏋️">
                        Stay on Top of Your Exercise: Your fitness aspirations
                        are within reach. Monitor your exercise routines, set
                        achievable goals, and witness your progress in real
                        time. Whether you are a seasoned athlete or just
                        starting, The exercise tracking feature in {appName}{' '}
                        keeps you motivated and moving towards your health
                        goals.
                    </List.Item>
                    <List.Item icon="🚰">
                        Hydration Made Simple: Proper hydration is the
                        foundation of wellness. Track your water intake
                        effortlessly with {appName}. Our hydration tracker
                        ensures you are sipping your way to optimal health
                        throughout the day.
                    </List.Item>
                    <List.Item icon="👩‍🌾">
                        Collaborate with a Nutrition Expert: Embark on your
                        health journey with the guidance of a certified
                        nutritionist. With {appName}, you can collaborate with
                        your expert who understands your goals, preferences, and
                        dietary needs, collaborating with a tailored plan that
                        helps you succeed.
                    </List.Item>
                </List>
                <Text size="lg">
                    Discover a holistic approach to health that is rooted in
                    simplicity and effectiveness. Join the {appName} community
                    today and take charge of your well-being like never before.
                    Your journey towards a healthier, happier you starts here.
                </Text>
                <Line />
            </Stack>
        </Center>
    );
}
