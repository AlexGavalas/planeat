import calendarStyles from './calendar-skeleton.module.css';
import styles from './loading-skeleton.module.css';
import pageStyles from './page-skeletons.module.css';

const Lines = ({ count = 3 }: Readonly<{ count?: number }>) => (
    <div className={styles.lines}>
        {Array.from({ length: count }, (_, index) => (
            <div key={index} className={`${styles.skeleton} ${styles.line}`} />
        ))}
    </div>
);

export const SkeletonCard = ({
    children,
}: Readonly<{ children: React.ReactNode }>) => (
    <div className={styles.card}>{children}</div>
);

export const SkeletonLoader = ({
    children,
}: Readonly<{ children: React.ReactNode }>) => (
    <div aria-label="Loading" className={styles.loader} role="status">
        <span className={styles.visuallyHidden}>Loading</span>
        <div aria-hidden="true">{children}</div>
    </div>
);

export function DailyMealsSkeleton() {
    return (
        <SkeletonLoader>
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
        </SkeletonLoader>
    );
}

export function MeasurementDashboardSkeleton() {
    return (
        <SkeletonLoader>
            <div className={styles.dashboard}>
                {[0, 1].map((item) => (
                    <SkeletonCard key={item}>
                        <div
                            className={`${styles.skeleton} ${styles.heading}`}
                        />
                        <div
                            className={`${styles.skeleton} ${styles.metric}`}
                        />
                        <div className={`${styles.skeleton} ${styles.chart}`} />
                    </SkeletonCard>
                ))}
            </div>
        </SkeletonLoader>
    );
}

export function TableSectionSkeleton() {
    return (
        <SkeletonLoader>
            <div className={styles.sectionHeading}>
                <div className={`${styles.skeleton} ${styles.heading}`} />
                <div className={`${styles.skeleton} ${styles.button}`} />
            </div>
            <Lines count={4} />
        </SkeletonLoader>
    );
}

export function ConnectionsSectionSkeleton() {
    return (
        <SkeletonLoader>
            <Lines count={3} />
        </SkeletonLoader>
    );
}

export function ConnectionsPageSkeleton() {
    return (
        <SkeletonLoader>
            <div className={pageStyles.connectionsPage}>
                <div className={pageStyles.connectionsHeader}>
                    <div>
                        <div className={`${styles.skeleton} ${styles.title}`} />
                        <div
                            className={`${styles.skeleton} ${styles.subtitle}`}
                        />
                    </div>
                    <div
                        className={`${styles.skeleton} ${styles.button} ${pageStyles.mobileButton}`}
                    />
                </div>
                <div className={pageStyles.connectionsGrid}>
                    {[0, 1, 2].map((item) => (
                        <div
                            key={item}
                            className={
                                item === 0
                                    ? pageStyles.connectionsCare
                                    : undefined
                            }
                        >
                            <SkeletonCard>
                                <div
                                    className={`${styles.skeleton} ${styles.heading}`}
                                />
                                <Lines />
                            </SkeletonCard>
                        </div>
                    ))}
                </div>
            </div>
        </SkeletonLoader>
    );
}

export function SettingsPageSkeleton() {
    return (
        <SkeletonLoader>
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
                    <SkeletonCard key={item}>
                        <TableSectionSkeleton />
                    </SkeletonCard>
                ))}
            </div>
        </SkeletonLoader>
    );
}

export function MealPlanPageSkeleton() {
    return (
        <SkeletonLoader>
            <div className={calendarStyles.calendarControls}>
                <div className={`${styles.skeleton} ${styles.button}`} />
                <div className={`${styles.skeleton} ${styles.wideControl}`} />
                <div className={`${styles.skeleton} ${styles.button}`} />
            </div>
            <SkeletonCard>
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
            </SkeletonCard>
        </SkeletonLoader>
    );
}
