import { Space } from '@mantine/core';

import { Card } from '~components/card';
import { LoadingOverlay } from '~components/loading-overlay';
import { useMeals } from '~store/hooks';

import styles from './calendar.module.css';
import { Content } from './content';
import { Controls } from './controls';
import { Header } from './header';

export const Calendar = () => {
    const { isLoading } = useMeals();

    return (
        <section className={styles.container} id="meal-plan-container">
            <LoadingOverlay visible={isLoading} />
            <Controls />
            <Space h="md" />
            <Header />
            <Card>
                <Content />
            </Card>
        </section>
    );
};
