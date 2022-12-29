import { Flex, Stack, Title, Tooltip } from '@mantine/core';
import { NavArrowDown } from 'iconoir-react';

import styles from './indicator.module.css';

interface ProgressIndicatorProps {
    label: string;
    value: number | null;
    percent: number | null;
    sections: Section[];
}

export const ProgressIndicator = ({
    label,
    percent,
    value,
    sections,
}: ProgressIndicatorProps) => {
    return (
        <Stack>
            <Title order={3}>{label}</Title>
            {Boolean(value) && (
                <div
                    className={styles.indicator}
                    style={{
                        left: `calc(${percent}% - 50px)`,
                    }}
                >
                    {value} %
                    <NavArrowDown />
                </div>
            )}
            <Flex>
                {sections.map(({ label, percent, bg }) => (
                    <Tooltip key={label} label={label} position="bottom">
                        <div
                            className={styles.section}
                            style={{
                                width: `${percent}%`,
                                backgroundColor: bg,
                            }}
                        />
                    </Tooltip>
                ))}
            </Flex>
        </Stack>
    );
};
