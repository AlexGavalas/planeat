import { Box, Title } from '@mantine/core';
import { NavArrowDown } from 'iconoir-react';

import styles from './indicator.module.css';

type Section = {
    label: string;
    percent: number;
    bg: string;
};

interface ProgressIndicatorProps {
    label: string;
    value: number;
    percent: number;
    sections: Section[];
}

export const ProgressIndicator = ({
    label,
    percent,
    value,
    sections,
}: ProgressIndicatorProps) => {
    return (
        <Box>
            <Title order={3}>{label}</Title>
            <div
                className={styles.indicator}
                style={{
                    left: `calc(${percent}% - 50px)`,
                }}
            >
                {value} %
                <NavArrowDown />
            </div>
            <div className={styles.sections}>
                {sections.map(({ label, percent, bg }) => (
                    <div
                        key={label}
                        className={styles.section}
                        style={{
                            width: `${percent}%`,
                            backgroundColor: bg,
                        }}
                    >
                        {label}
                    </div>
                ))}
            </div>
        </Box>
    );
};
