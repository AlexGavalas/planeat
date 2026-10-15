import type { ReactElement } from 'react';

import { SettingsPageSkeleton } from '~components/loading-skeleton';

const Loading = (): ReactElement => {
    return <SettingsPageSkeleton />;
};

export default Loading;
