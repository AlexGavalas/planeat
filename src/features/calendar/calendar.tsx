import { Space } from '@mantine/core';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import { Card } from '~components/card';
import { LoadingOverlay } from '~components/loading-overlay';
import { useMeals } from '~store/hooks';

import styles from './calendar.module.css';
import { Content } from './content';
import { Controls } from './controls';
import { Header } from './header';

export const Calendar = () => {
    const ref = useRef<HTMLDivElement>(null);
    const { isLoading } = useMeals();

    const handlePrint = useReactToPrint({
        bodyClass: `${styles.print} ${styles.container}`,
        content: () => ref.current,
    });

    return (
        <section className={styles.container} id="meal-plan-container">
            <LoadingOverlay visible={isLoading} />
            <Controls onPrint={handlePrint} />
            <Space h="md" />
            <div ref={ref}>
                <Header />
                <Card>
                    <Content />
                </Card>
            </div>
        </section>
    );
};
