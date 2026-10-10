import {
    DailyMealsSkeleton,
    SkeletonCard,
    SkeletonLoader,
} from './loading-skeleton';
import styles from './loading-skeleton.module.css';
import pageStyles from './page-skeletons.module.css';

const Lines = () => (
    <div className={styles.lines}>
        {[0, 1].map((item) => (
            <div className={`${styles.skeleton} ${styles.line}`} key={item} />
        ))}
    </div>
);

export function HomePageSkeleton() {
    return (
        <SkeletonLoader>
            <div className={pageStyles.homeDashboard}>
                <div className={pageStyles.homeHeader}>
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
                <div className={pageStyles.homeSummaryGrid}>
                    {[0, 1, 2].map((item) => (
                        <SkeletonCard key={item}>
                            <Lines />
                        </SkeletonCard>
                    ))}
                </div>
                <div className={pageStyles.homeContentGrid}>
                    <SkeletonCard>
                        <DailyMealsSkeleton />
                    </SkeletonCard>
                    <SkeletonCard>
                        <div
                            className={`${styles.skeleton} ${styles.heading}`}
                        />
                        <div
                            className={`${styles.skeleton} ${styles.metric}`}
                        />
                        <Lines />
                    </SkeletonCard>
                </div>
            </div>
        </SkeletonLoader>
    );
}
