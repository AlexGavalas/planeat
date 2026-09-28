import { type ReactNode } from 'react';

import { requireUser } from '~api/session';

export default async function ProtectedLayout({
    children,
}: Readonly<{ children: ReactNode }>) {
    await requireUser();
    return children;
}
