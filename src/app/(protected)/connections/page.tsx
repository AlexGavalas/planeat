import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Suspense } from 'react';

import { fetchUserConnections } from '~api/connection';
import { fetchConnectionRequestNotifications } from '~api/notification';
import { requireUser } from '~api/session';
import { ConnectionsSectionSkeleton } from '~components/loading-skeleton';
import { ManageConnectionRequests } from '~features/manage-connection-requests';
import { ManageConnections } from '~features/manage-connections';
import { Connections } from '~features/screens/connections';
import { createQueryClient } from '~util/query-client';

async function ConnectionList() {
    const profile = await requireUser();
    const connections = await fetchUserConnections({ userId: profile.id });

    const client = createQueryClient();
    client.setQueryData(['connections'], connections.data);

    return (
        <HydrationBoundary state={dehydrate(client)}>
            <ManageConnections />
        </HydrationBoundary>
    );
}

async function RequestList() {
    const profile = await requireUser();
    const requests = await fetchConnectionRequestNotifications({
        userId: profile.id,
    });

    const client = createQueryClient();
    client.setQueryData(['connection-requests', profile.id], requests.data);

    return (
        <HydrationBoundary state={dehydrate(client)}>
            <ManageConnectionRequests />
        </HydrationBoundary>
    );
}

export default function Page() {
    return (
        <Connections
            connections={
                <Suspense fallback={<ConnectionsSectionSkeleton />}>
                    <ConnectionList />
                </Suspense>
            }
            requests={
                <Suspense fallback={<ConnectionsSectionSkeleton />}>
                    <RequestList />
                </Suspense>
            }
        />
    );
}
