import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import type { ReactElement } from 'react';
import { Suspense } from 'react';

import { fetchUserConnections } from '~api/connection';
import { fetchConnectionRequestNotifications } from '~api/notification';
import { fetchProfessionalConnectionState } from '~api/professional';
import { requireUser } from '~api/session';
import { ConnectionsSectionSkeleton } from '~components/loading-skeleton';
import { ManageConnectionRequests } from '~features/manage-connection-requests';
import { ManageConnections } from '~features/manage-connections';
import { ProfessionalConnections } from '~features/professional-connections';
import { Connections } from '~features/screens/connections';
import { createQueryClient } from '~util/query-client';

const ConnectionList = async (): Promise<ReactElement> => {
    const profile = await requireUser();
    const connections = await fetchUserConnections({ userId: profile.id });

    const client = createQueryClient();
    client.setQueryData(['connections'], connections.data);

    return (
        <HydrationBoundary state={dehydrate(client)}>
            <ManageConnections />
        </HydrationBoundary>
    );
};

const RequestList = async (): Promise<ReactElement> => {
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
};

const ProfessionalSection = async (): Promise<ReactElement> => {
    const profile = await requireUser();
    const state = await fetchProfessionalConnectionState(profile.id);

    const client = createQueryClient();
    client.setQueryData(['professional-connections', profile.id], state);

    return (
        <HydrationBoundary state={dehydrate(client)}>
            <ProfessionalConnections />
        </HydrationBoundary>
    );
};

const Page = (): ReactElement => {
    return (
        <Connections
            connections={
                <Suspense fallback={<ConnectionsSectionSkeleton />}>
                    <ConnectionList />
                </Suspense>
            }
            professional={
                <Suspense fallback={<ConnectionsSectionSkeleton />}>
                    <ProfessionalSection />
                </Suspense>
            }
            requests={
                <Suspense fallback={<ConnectionsSectionSkeleton />}>
                    <RequestList />
                </Suspense>
            }
        />
    );
};

export default Page;
