'use client';

import { Button, Group, Stack, Text, Title } from '@mantine/core';
import {
    BellNotification,
    Calendar,
    CheckCircle,
    Community,
    Copy,
    PrintingPage,
    StatsReport,
} from 'iconoir-react';
import Image from 'next/image';

import { openAuthDialog } from '~features/header/auth-dialog-event';

import styles from './landing.module.css';

const features = [
    {
        description:
            'Arrange morning meals, snacks, lunch, and dinner in a clear weekly view. Add meals from your Meal Pool or import the files you already use.',
        icon: Calendar,
        title: 'Plan the whole week',
    },
    {
        description:
            "Open Planeat to see today's meals immediately, then opt in to a reminder with tomorrow's plan when it helps.",
        icon: BellNotification,
        title: 'Keep today simple',
    },
    {
        description:
            'Log weight and body-fat measurements, follow BMI and measurement changes, and keep a dated record of your activities.',
        icon: StatsReport,
        title: 'Track changes over time',
    },
    {
        description:
            'Set a target weight, note foods you like or avoid, choose your language, and connect with other Planeat users.',
        icon: Community,
        title: 'Make it personal',
    },
] as const;

const steps = [
    {
        description:
            'Create meals from your Meal Pool or import an existing meal file.',
        title: 'Gather your meals',
    },
    {
        description:
            'Place each meal into the week, from breakfast through dinner.',
        title: 'Build the week',
    },
    {
        description:
            'Check today at a glance and log measurements or activities as you go.',
        title: 'Follow your progress',
    },
] as const;

export function LandingPage() {
    const handleCreateAccount = () => {
        openAuthDialog('register');
    };

    return (
        <main className={styles.content}>
            <section className={styles.hero}>
                <Stack className={styles.heroCopy} gap="lg">
                    <Text className={styles.eyebrow}>
                        Meal planning, made clear
                    </Text>
                    <Title className={styles.heroTitle} order={1}>
                        Plan your meals.
                        <br />
                        See your progress.
                    </Title>
                    <Text className={styles.heroDescription}>
                        Build your weekly meal plan, keep today&apos;s meals
                        close at hand, and track the measurements and activities
                        that matter to you.
                    </Text>
                    <Group className={styles.heroActions} gap="sm">
                        <Button onClick={handleCreateAccount} size="lg">
                            Create an account
                        </Button>
                        <Button
                            component="a"
                            href="#features"
                            size="lg"
                            variant="outline"
                        >
                            Explore features
                        </Button>
                    </Group>
                    <Group className={styles.proofPoints} gap="lg">
                        <Text component="span">
                            <CheckCircle aria-hidden /> Installable on your
                            device
                        </Text>
                    </Group>
                </Stack>

                <figure className={styles.heroVisual}>
                    <Image
                        preload
                        alt="A weekly meal planner with meal ideas beside a phone"
                        className={styles.heroImage}
                        height={1024}
                        sizes="(max-width: 48em) calc(100vw - 2rem), (max-width: 75em) 48vw, 36rem"
                        src="/images/meal-planning-hero.webp"
                        width={1536}
                    />
                    <figcaption className={styles.heroCaption}>
                        One place for the meals you have planned and the habits
                        you want to follow.
                    </figcaption>
                </figure>
            </section>

            <section className={styles.features} id="features">
                <div className={styles.sectionHeading}>
                    <Text className={styles.eyebrow}>What Planeat does</Text>
                    <Title order={2}>A practical rhythm for every week</Title>
                    <Text>
                        Plan ahead without losing sight of today. Planeat keeps
                        the useful details together and leaves the rest out of
                        your way.
                    </Text>
                </div>

                <div className={styles.featureGrid}>
                    {features.map(({ description, icon: Icon, title }) => (
                        <article key={title} className={styles.featureCard}>
                            <div className={styles.featureIcon}>
                                <Icon aria-hidden />
                            </div>
                            <Title order={3}>{title}</Title>
                            <Text>{description}</Text>
                        </article>
                    ))}
                </div>
            </section>

            <section className={styles.utilityStrip}>
                <div>
                    <Text className={styles.eyebrow}>
                        Ready when you need it
                    </Text>
                    <Title order={2}>Your plan should travel well.</Title>
                    <Text>
                        Review the whole week, carry it forward, or put a paper
                        copy on the fridge.
                    </Text>
                </div>
                <div className={styles.utilityItems}>
                    <Text component="span">
                        <StatsReport aria-hidden /> Weekly overview
                    </Text>
                    <Text component="span">
                        <Copy aria-hidden /> Copy next week
                    </Text>
                    <Text component="span">
                        <PrintingPage aria-hidden /> Print your plan
                    </Text>
                </div>
            </section>

            <section className={styles.steps}>
                <div className={styles.sectionHeading}>
                    <Text className={styles.eyebrow}>How it works</Text>
                    <Title order={2}>From ideas to a useful routine</Title>
                </div>
                <ol className={styles.stepList}>
                    {steps.map(({ description, title }, index) => (
                        <li key={title}>
                            <Text
                                className={styles.stepNumber}
                                component="span"
                            >
                                {index + 1}
                            </Text>
                            <Title order={3}>{title}</Title>
                            <Text>{description}</Text>
                        </li>
                    ))}
                </ol>
            </section>

            <section className={styles.callToAction}>
                <div>
                    <Text className={styles.eyebrow}>Start with next week</Text>
                    <Title order={2}>
                        Make room for the meals that matter.
                    </Title>
                    <Text>
                        Create your free Planeat account and build your first
                        weekly plan.
                    </Text>
                </div>
                <Button color="dark" onClick={handleCreateAccount} size="lg">
                    Get started
                </Button>
            </section>
        </main>
    );
}
