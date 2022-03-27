import { Box, Title, Tooltip } from '@mantine/core';
import { NavArrowDown } from 'iconoir-react';

import styles from './indicator.module.css';

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
            <Box>
                {sections.map(({ label, percent, bg }) => (
                    <Tooltip
                        key={label}
                        label={label}
                        style={{ width: `${percent}%`, backgroundColor: bg }}
                        position="bottom"
                        className={styles.section}
                    >
                        <div />
                    </Tooltip>
                ))}
            </Box>
        </Box>
    );
};
