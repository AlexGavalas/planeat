'use client';

import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { Copy, PrintingPage, StatsReport } from 'iconoir-react';
import Image from 'next/image';

import { openAuthDialog } from '~features/header/auth-dialog-event';
import { InstallApp } from '~features/install-app';

import { features, steps } from './landing-content';
import heroStyles from './landing-hero.module.css';
import utilityStyles from './landing-utility.module.css';
import styles from './landing.module.css';

export function LandingPage() {
    const handleCreateAccount = () => {
        openAuthDialog('register');
    };

    return (
        <main className={styles.content}>
            <section className={heroStyles.hero}>
                <Stack className={heroStyles.heroCopy} gap="lg">
                    <Text className={styles.eyebrow}>
                        Meal planning, made clear
                    </Text>
                    <Title className={heroStyles.heroTitle} order={1}>
                        Plan your meals.
                        <br />
                        See your progress.
                    </Title>
                    <Text className={heroStyles.heroDescription}>
                        Build your weekly meal plan, keep today&apos;s meals
                        close at hand, and track the measurements and activities
                        that matter to you.
                    </Text>
                    <Group className={heroStyles.heroActions} gap="sm">
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
                    <Group className={heroStyles.proofPoints} gap="lg">
                        <InstallApp />
                    </Group>
                </Stack>

                <figure className={heroStyles.heroVisual}>
                    <Image
                        preload
                        alt="A weekly meal planner with meal ideas beside a phone"
                        className={heroStyles.heroImage}
                        height={1024}
                        sizes="(max-width: 48em) calc(100vw - 2rem), (max-width: 75em) 48vw, 36rem"
                        src="/images/meal-planning-hero.webp"
                        width={1536}
                    />
                    <figcaption className={heroStyles.heroCaption}>
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

            <section className={utilityStyles.utilityStrip}>
                <div>
                    <Text
                        className={`${styles.eyebrow} ${utilityStyles.utilityEyebrow}`}
                    >
                        Ready when you need it
                    </Text>
                    <Title className={utilityStyles.utilityHeading} order={2}>
                        Your plan should travel well.
                    </Title>
                    <Text className={utilityStyles.utilityDescription}>
                        Review the whole week, carry it forward, or put a paper
                        copy on the fridge.
                    </Text>
                </div>
                <div className={utilityStyles.utilityItems}>
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
