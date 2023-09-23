import { Progress, Stack, Text, Title } from '@mantine/core';
import { NavArrowDown } from 'iconoir-react';

import { type Section } from '~types/types';

import styles from './indicator.module.css';

interface ProgressIndicatorProps {
    label: string;
    value: number | null;
    percent: number | null;
    sections: (Section & { label: string })[];
}

export const ProgressIndicator = ({
    label,
    percent,
    value,
    sections,
}: ProgressIndicatorProps) => {
    return (
        <Stack gap="xs">
            <Title order={3}>{label}</Title>
            {Boolean(value) && (
                <div
                    className={styles.indicator}
                    style={{
                        left: `calc(${percent}% - 50px)`,
                    }}
                >
                    <Text>{value}%</Text>
                    <NavArrowDown />
                </div>
            )}
            <Progress.Root
                size="xl"
                style={{
                    height: '2rem',
                }}
            >
                {sections.map((section) => (
                    <Progress.Section
                        key={section.key}
                        value={section.percent}
                        color={section.bg}
                    >
                        <Progress.Label>{section.label}</Progress.Label>
                    </Progress.Section>
                ))}
            </Progress.Root>
        </Stack>
    );
};
