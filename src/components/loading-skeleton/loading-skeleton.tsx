import calendarStyles from './calendar-skeleton.module.css';
import styles from './loading-skeleton.module.css';

const Lines = ({ count = 3 }: Readonly<{ count?: number }>) => (
    <div className={styles.lines}>
        {Array.from({ length: count }, (_, index) => (
            <div key={index} className={`${styles.skeleton} ${styles.line}`} />
        ))}
    </div>
);

const Card = ({ children }: Readonly<{ children: React.ReactNode }>) => (
    <div className={styles.card}>{children}</div>
);

const Loader = ({ children }: Readonly<{ children: React.ReactNode }>) => (
    <div aria-label="Loading" className={styles.loader} role="status">
        <span className={styles.visuallyHidden}>Loading</span>
        <div aria-hidden="true">{children}</div>
    </div>
);

export function DailyMealsSkeleton() {
    return (
        <Loader>
            <div className={`${styles.skeleton} ${styles.heading}`} />
            <div className={styles.timeline}>
                {Array.from({ length: 5 }, (_, index) => (
                    <div key={index} className={styles.timelineItem}>
                        <div
                            className={`${styles.skeleton} ${styles.circle}`}
                        />
                        <Lines count={2} />
                    </div>
                ))}
            </div>
        </Loader>
    );
}

export function MeasurementDashboardSkeleton() {
    return (
        <Loader>
            <div className={styles.dashboard}>
                {[0, 1].map((item) => (
                    <Card key={item}>
                        <div
                            className={`${styles.skeleton} ${styles.heading}`}
                        />
                        <div
                            className={`${styles.skeleton} ${styles.metric}`}
                        />
                        <div className={`${styles.skeleton} ${styles.chart}`} />
                    </Card>
                ))}
            </div>
        </Loader>
    );
}

export function TableSectionSkeleton() {
    return (
        <Loader>
            <div className={styles.sectionHeading}>
                <div className={`${styles.skeleton} ${styles.heading}`} />
                <div className={`${styles.skeleton} ${styles.button}`} />
            </div>
            <Lines count={4} />
        </Loader>
    );
}

export function ConnectionsSectionSkeleton() {
    return (
        <Loader>
            <Lines count={3} />
        </Loader>
    );
}

export function HomePageSkeleton() {
    return (
        <div className={styles.homeGrid}>
            <Card>
                <DailyMealsSkeleton />
            </Card>
            <MeasurementDashboardSkeleton />
        </div>
    );
}

export function ConnectionsPageSkeleton() {
    return (
        <Loader>
            <div className={styles.connectionsPage}>
                <div className={styles.connectionsHeader}>
                    <div>
                        <div className={`${styles.skeleton} ${styles.title}`} />
                        <div
                            className={`${styles.skeleton} ${styles.subtitle}`}
                        />
                    </div>
                    <div className={`${styles.skeleton} ${styles.button}`} />
                </div>
                <div className={styles.connectionsGrid}>
                    {[0, 1, 2].map((item) => (
                        <div
                            key={item}
                            className={
                                item === 0 ? styles.connectionsCare : undefined
                            }
                        >
                            <Card>
                                <div
                                    className={`${styles.skeleton} ${styles.heading}`}
                                />
                                <Lines />
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </Loader>
    );
}

export function SettingsPageSkeleton() {
    return (
        <Loader>
            <div className={styles.settingsPage}>
                <div className={styles.tabs}>
                    {Array.from({ length: 3 }, (_, index) => (
                        <div
                            key={index}
                            className={`${styles.skeleton} ${styles.tab}`}
                        />
                    ))}
                </div>
                {[0, 1].map((item) => (
                    <Card key={item}>
                        <TableSectionSkeleton />
                    </Card>
                ))}
            </div>
        </Loader>
    );
}

export function MealPlanPageSkeleton() {
    return (
        <Loader>
            <div className={calendarStyles.calendarControls}>
                <div className={`${styles.skeleton} ${styles.button}`} />
                <div className={`${styles.skeleton} ${styles.wideControl}`} />
                <div className={`${styles.skeleton} ${styles.button}`} />
            </div>
            <Card>
                <div className={calendarStyles.calendarShell}>
                    <div className={calendarStyles.calendarHeader}>
                        {Array.from({ length: 8 }, (_, index) => (
                            <div
                                key={index}
                                className={`${styles.skeleton} ${calendarStyles.calendarHeaderCell}`}
                            />
                        ))}
                    </div>
                    <div className={calendarStyles.calendarRows}>
                        {Array.from({ length: 3 }, (_, index) => (
                            <div
                                key={index}
                                className={calendarStyles.calendarRow}
                            >
                                <div
                                    className={`${styles.skeleton} ${calendarStyles.calendarRowLabel}`}
                                />
                                <div
                                    className={`${styles.skeleton} ${calendarStyles.calendarRowContent}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </Loader>
    );
}
