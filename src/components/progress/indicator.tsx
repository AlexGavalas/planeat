import { Progress, Stack, Text, Title } from '@mantine/core';
import { NavArrowDown } from 'iconoir-react';

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
        <Stack spacing="xs">
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
            <Progress
                size="xl"
                style={{
                    height: '2rem',
                }}
                sections={sections.map((section) => ({
                    color: section.bg,
                    value: section.percent,
                    label: section.label,
                }))}
            />
        </Stack>
    );
};
