import { Progress, Stack, Text, Title } from '@mantine/core';
import { NavArrowDown } from 'iconoir-react';
import { type CSSProperties } from 'react';

import { type Section } from '~types/types';

import styles from './indicator.module.css';

type ProgressIndicatorProps = Readonly<{
    label: string;
    value: number | null;
    percent: number | null;
    sections: (Section & { label: string })[];
}>;

export const ProgressIndicator = ({
    label,
    percent,
    value,
    sections,
}: ProgressIndicatorProps) => {
    return (
        <Stack gap="xs">
            <Title order={3}>{label}</Title>
            <div className={styles.scale}>
                {Boolean(value) && (
                    <div
                        className={styles.indicator}
                        style={
                            {
                                '--indicator-position': `${Math.min(
                                    100,
                                    Math.max(0, percent ?? 0),
                                )}%`,
                            } as CSSProperties
                        }
                    >
                        <Text>{value}%</Text>
                        <NavArrowDown />
                    </div>
                )}
                <Progress.Root className={styles.progress} size="xl">
                    {sections.map((section) => (
                        <Progress.Section
                            key={section.key}
                            color={section.bg}
                            value={section.percent}
                        >
                            <Progress.Label className={styles.progressLabel}>
                                {section.label}
                            </Progress.Label>
                        </Progress.Section>
                    ))}
                </Progress.Root>
            </div>
            <div className={styles.legend}>
                {sections.map((section) => (
                    <div key={section.key} className={styles.legendItem}>
                        <span
                            aria-hidden
                            className={styles.swatch}
                            style={{ backgroundColor: section.bg }}
                        />
                        <Text size="sm">{section.label}</Text>
                    </div>
                ))}
            </div>
        </Stack>
    );
};
