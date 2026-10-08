import {
    BellNotification,
    Calendar,
    Community,
    StatsReport,
} from 'iconoir-react';

export const features = [
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

export const steps = [
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
