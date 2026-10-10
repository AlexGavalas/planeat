import { Space } from '@mantine/core';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import { Card } from '~components/card';
import { LoadingOverlay } from '~components/loading-overlay';
import { useMeals } from '~store/hooks';

import styles from './calendar.module.css';
import { Content } from './content';
import { Controls } from './controls';
import { DailyNutrition } from './daily-nutrition';
import { Header } from './header';
import { MobileContent } from './mobile-content';

export const Calendar = ({
    initialDate,
}: Readonly<{ initialDate: string }>) => {
    const ref = useRef<HTMLDivElement>(null);
    const { isLoading } = useMeals();

    const handlePrint = useReactToPrint({
        bodyClass: `${styles.print} ${styles.container}`,
        contentRef: ref,
    });

    return (
        <section className={styles.container}>
            <LoadingOverlay visible={isLoading} />
            <div id="meal-plan-container">
                <Controls onPrint={handlePrint} />
            </div>
            <Space h="md" />
            <div ref={ref} className={styles.desktopCalendar}>
                <Header />
                <DailyNutrition />
                <Card>
                    <Content />
                </Card>
            </div>
            <div className={styles.mobileCalendar}>
                <MobileContent initialDate={initialDate} />
            </div>
        </section>
    );
};
