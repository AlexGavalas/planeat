import type { ReactElement } from 'react';

import { MealPlanPageSkeleton } from '~components/loading-skeleton';

const Loading = (): ReactElement => {
    return <MealPlanPageSkeleton />;
};

export default Loading;
