import type { ReactElement } from 'react';

import { HomePageSkeleton } from '~components/loading-skeleton';

const Loading = (): ReactElement => {
    return <HomePageSkeleton />;
};

export default Loading;
