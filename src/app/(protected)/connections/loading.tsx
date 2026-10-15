import type { ReactElement } from 'react';

import { ConnectionsPageSkeleton } from '~components/loading-skeleton';

const Loading = (): ReactElement => {
    return <ConnectionsPageSkeleton />;
};

export default Loading;
