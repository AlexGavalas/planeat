import { Text, UnstyledButton } from '@mantine/core';
import { format } from 'date-fns';

import styles from './mobile-content.module.css';

type MobileDayButtonProps = Readonly<{
    date: Date;
    index: number;
    label?: string;
    onSelect: (index: number) => void;
    selected: boolean;
}>;

export const MobileDayButton = ({
    date,
    index,
    label,
    onSelect,
    selected,
}: MobileDayButtonProps) => {
    const handleClick = (): void => {
        onSelect(index);
    };

    return (
        <UnstyledButton
            aria-pressed={selected}
            className={styles.dayButton}
            onClick={handleClick}
        >
            <Text fw="var(--mantine-font-weight-bold)" size="sm">
                {label}
            </Text>
            <Text size="sm">{format(date, 'dd/MM')}</Text>
        </UnstyledButton>
    );
};
