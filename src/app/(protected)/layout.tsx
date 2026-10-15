import { type ReactNode } from 'react';

import { requireUser } from '~api/session';

const ProtectedLayout = async ({
    children,
}: Readonly<{ children: ReactNode }>): Promise<ReactNode> => {
    await requireUser();
    return children;
};

export default ProtectedLayout;
